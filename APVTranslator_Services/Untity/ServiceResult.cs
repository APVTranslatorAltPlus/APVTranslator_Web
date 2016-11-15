using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace APVTranslator_Services.Untity
{
    public class ServiceResult
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
                try
                {
                    if (value != null)
                    {
                        _Value = JsonConvert.SerializeObject(value, Formatting.Indented,
new JsonSerializerSettings
{
    PreserveReferencesHandling = PreserveReferencesHandling.Objects
});
                    }
                }
                catch (Exception e)
                {
                    Debug.WriteLine(e.ToString());
                }

            }
        }
        public string Message { get; set; }
    }
}