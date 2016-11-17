﻿using APVTranslator_Common;
using APVTranslator_Entity.Models;
using APVTranslator_Model.Models;
using APVTranslators_Entity.Entity;
using Microsoft.Web.WebSockets;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace APVTranslator_Web.Socket
{
    public class wsHandler : WebSocketHandler
    {
        private static WebSocketCollection clients = new WebSocketCollection();
        private int userId;
        private Color userColor = new Color();
        private string userName;
        public override void OnOpen()
        {
            this.Send("Welcome!" + this.WebSocketContext.User.Identity.Name);
            this.userId = SessionUser.GetUserId();
            this.userName = this.WebSocketContext.User.Identity.Name;
            this.userColor = GetColor();
            //this.id = Convert.ToInt32(Cypher.Decrypt(this.WebSocketContext.QueryString["id"]));
            clients.Add(this);
        }

        public override void OnMessage(string message)
        {
            try
            {
                TranslateMessage translateMessage;
                if (!string.IsNullOrEmpty(message))
                {
                    TranslateModel translateModel = new TranslateModel();
                    translateMessage = JsonConvert.DeserializeObject<TranslateMessage>(message);
                    Task taskHandlingMessage = HandlingMessage(translateMessage, translateModel);
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        private async Task HandlingMessage(TranslateMessage translateMessage, TranslateModel translateModel)
        {
            Boolean bReult = false;
            await Task.Run(() => bReult = translateModel.SaveTextSegment(translateMessage));
            translateMessage.SendTime = DateTime.Now;
            translateMessage.UserId = this.userId;
            translateMessage.UserName = this.userName;
            translateMessage.Color = this.userColor.Name;
            if (bReult)
            {
                foreach (var item in clients)
                {
                    string msgBack = JsonConvert.SerializeObject(translateMessage);
                    item.Send(msgBack);
                };
            }
            else
            {
                string msgBack = string.Format("{0} have sent {1} at {2}", this.WebSocketContext.User.Identity.Name, "Something error!", DateTime.Now.ToLongTimeString());
                this.Send(msgBack);
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

        private Color GetColor()
        {
            Color color;
            do
            {
                Random random = new Random();
                KnownColor[] values = (KnownColor[])Enum.GetValues(typeof(KnownColor));
                color = Color.FromKnownColor(values[random.Next(values.Length)]);
            }
            while (!(color.Name != "Black") || !(color.Name != "Red") || (!(color.Name != "ActiveCaptionText") || !(color.Name != "White")) || !(color.Name != "WhiteSmoke"));
            return color;
        }
    }
}