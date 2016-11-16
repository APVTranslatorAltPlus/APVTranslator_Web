using APVTranslator_Entity.Models;
using APVTranslator_Model.Models;
using Microsoft.Web.WebSockets;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace APVTranslator_Web.Socket
{
    public class wsHandler : WebSocketHandler
    {
        private static WebSocketCollection clients = new WebSocketCollection();
        private int id;

        public override void OnOpen()
        {
            this.Send("Welcome!" + this.WebSocketContext.User.Identity.Name);
            //this.id = Convert.ToInt32(Cypher.Decrypt(this.WebSocketContext.QueryString["id"]));
            clients.Add(this);
        }

        public override void OnMessage(string message)
        {
            try
            {
                if (!string.IsNullOrEmpty(message))
                {
                    TranslateModel translateModel = new TranslateModel();
                    TextSegment textSegment = JsonConvert.DeserializeObject<TextSegment>(message);
                    translateModel.SaveTextSegment(textSegment);
                }
                foreach (var item in clients)
                {
                    string msgBack = string.Format(
                    "{0} have sent {1} at {2}", this.WebSocketContext.User.Identity.Name, message, DateTime.Now.ToLongTimeString());
                    item.Send(msgBack);
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public override void OnClose()
        {
            base.OnClose();
        }

        public override void OnError()
        {
            base.OnError();
        }
    }
}