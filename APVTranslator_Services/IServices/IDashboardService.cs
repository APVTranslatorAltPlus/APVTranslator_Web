using APVTranslator_Services.Untity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace APVTranslator_Services.Services
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IDashboardService" in both code and config file together.
    [ServiceContract]
    public interface IDashboardService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        ServiceResult GetListProject();
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        ServiceResult GetListFileProject(object projectID);
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        ServiceResult DeleteFileProject(int projectId, string projectName, int fileId, string fileName);
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        bool CreateNewProject(object newProject, IEnumerable<int> listMember);
        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        ServiceResult GetListUser();
    }
}
