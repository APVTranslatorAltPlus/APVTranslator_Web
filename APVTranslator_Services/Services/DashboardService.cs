﻿using APVTranslator_Entity.Models;
using APVTranslator_Model.Models;
using APVTranslator_Services.Untity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace APVTranslator_Services.Services
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "DashboardService" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select DashboardService.svc or DashboardService.svc.cs at the Solution Explorer and start debugging.
    public class DashboardService : IDashboardService
    {
        /// <summary>
        /// Get List Project 
        /// </summary>
        /// <returns></returns>
        public ServiceResult GetListProject()
        {
            ServiceResult sResult = new ServiceResult();
            try
            {
                DashBoardModel dbModel = new DashBoardModel();
                sResult.Value = dbModel.Proc_GetListProject(1);
            }
            catch (Exception ex)
            {
                sResult.IsSuccess = false;
                sResult.Message = ex.Message;
            }
            return sResult;
        }
    }
}
