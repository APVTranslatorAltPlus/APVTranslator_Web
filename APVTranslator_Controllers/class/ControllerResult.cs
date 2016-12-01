using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace APVTranslator_Controllers
{
    public class ControllerResult
    {

        public Boolean IsSuccess { get; set; } = true;
        private Object _Value;
        public Object Value
        {
            get
            {
                return this._Value;
            }
            set
            {
                if (value != null)
                {
                    _Value = JsonConvert.SerializeObject(value, Formatting.Indented, new JsonSerializerSettings { PreserveReferencesHandling = PreserveReferencesHandling.Objects });
                }
            }
        }
        public string Message { get; set; }
    }
}
