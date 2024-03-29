//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ReactApplication.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using Newtonsoft.Json;

    public partial class Sale
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "This field is required")]
        public int ProductId { get; set; }
        [Required(ErrorMessage = "This field is required")]
        public int CustomerId { get; set; }
        [Required(ErrorMessage = "This field is required")]
        public int StoreId { get; set; }
        public System.DateTime DateSold { get; set; }

        [JsonIgnore]
        public  Customer Customer { get; set; }
        [JsonIgnore]
        public  Product Product { get; set; }
        [JsonIgnore]
        public  Store Store { get; set; }
    }
}
