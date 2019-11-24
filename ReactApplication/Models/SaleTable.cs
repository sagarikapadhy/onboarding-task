using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReactApplication.Models
{
    public class SaleTable
    {
        public int Id { get; set; }
        public string CustomerName { get; set; }
        public string ProductName { get; set; }       
        public string StoreName { get; set; }
        public int ProductId { get; set; }
        public int CustomerId { get; set; }
        public int StoreId { get; set; }
    }
}