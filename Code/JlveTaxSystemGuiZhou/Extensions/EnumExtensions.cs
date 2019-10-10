using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JlveTaxSystemGuiZhou.Extensions
{
    public static class EnumExtensions
    {
        public static TEnum Parse<TEnum>(string value) where TEnum : struct
        {
            return (TEnum)Enum.Parse(typeof(TEnum), value);
        }

    }
}