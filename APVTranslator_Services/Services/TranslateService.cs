using APVTranslator_Entity.Models;
using APVTranslator_Model.Models;
using APVTranslator_Services.Untity;
using APVTranslators_Entity.Entity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Web;

namespace APVTranslator_Services.Services
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "TranslateService" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select TranslateService.svc or TranslateService.svc.cs at the Solution Explorer and start debugging.
    public class TranslateService : ITranslateService
    {
        public ServiceResult GetSugestion(String listTexsegment)
        {
            ServiceResult sResult = new ServiceResult();
            try
            {
                var user = HttpContext.Current.User;
                if (user.Identity.IsAuthenticated)
                {
                    TranslateModel translateModel = new TranslateModel();
                    List<TextSegment> lstTextSegment = JsonConvert.DeserializeObject<List<TextSegment>>(listTexsegment);
                    if (lstTextSegment.Count > 0)
                    {
                        var projectId = lstTextSegment[0].ProjectId;
                        List<ReferenceDB> lstReferenceDB = new List<ReferenceDB>();
                        lstReferenceDB = translateModel.GetConditionData(projectId);
                        List<Int32> lstProjectIDRef = new List<int>();
                        foreach (ReferenceDB itReferenceDB in lstReferenceDB)
                        {
                            lstProjectIDRef.Add(itReferenceDB.ProjectReferID);
                        }
                        lstProjectIDRef.Add(projectId);
                        TextSuggestion oTextSuggestion = new TextSuggestion();

                        foreach (var item in lstTextSegment)
                        {
                            oTextSuggestion = translateModel.GetSuggestion(item.TextSegment1, lstProjectIDRef);
                            if (oTextSuggestion!=null)
                            {
                                item.Suggestion = oTextSuggestion.TextSegment2;
                            }
                        }
                    }
                    sResult.Value = lstTextSegment;
                }
            }
            catch (Exception ex)
            {
                sResult.IsSuccess = false;
                sResult.Message = "Some word can't get suggestion !";
            }
            return sResult;
        }
    }
}
