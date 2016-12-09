using APVTranslator_Web.Socket;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Web.WebSockets;

namespace APVTranslator_Web.Handler
{
    /// <summary>
    /// Summary description for SocketHandler
    /// </summary>
    public class SocketHandler : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            var projectId = context.Request["projectId"];
            var fileId = context.Request["fileId"];
            var reconnect = context.Request["reconnect"];
            if (projectId != null && fileId != null && (context.IsWebSocketRequest || context.IsWebSocketRequestUpgrading) && HttpContext.Current.User.Identity.IsAuthenticated)
            {
                Boolean breconnect = false;
                if (reconnect != null && Boolean.TryParse(reconnect, out breconnect))
                {
                    context.AcceptWebSocketRequest(new wsHandler(Convert.ToInt32(projectId), Convert.ToInt32(fileId), breconnect));
                }
                else
                {
                    context.AcceptWebSocketRequest(new wsHandler(Convert.ToInt32(projectId), Convert.ToInt32(fileId)));
                }
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}