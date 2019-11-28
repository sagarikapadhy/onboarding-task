using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using ReactApplication.Models;

namespace ReactApplication.Controllers
{
    public class SalesController : Controller
    {
        private OnboardingTaskEntities1 db = new OnboardingTaskEntities1();

        
        public ActionResult Index()
        {
            var sales = db.Sales.Include(s => s.Customer).Include(s => s.Product).Include(s => s.Store);
            return View(sales.ToList());
        }

        // GET: Sales
        public ActionResult getAllSales()
        {
            IList<Sale> salesList = new List<Sale>();
            IList<SaleTable> salesWithNavigationProperties = new List<SaleTable>();
            salesList = db.Sales.ToList();
            foreach (var sale in salesList)
            {
                SaleTable saleTable = new SaleTable();
                saleTable.Id = sale.Id;
                IList<string> names = db.Customers.Where(c => c.Id == sale.CustomerId).Select(c => c.Name)
                            .Concat(db.Products.Where(p => p.Id == sale.ProductId).Select(p => p.Name))
                            .Concat(db.Stores.Where(s => s.Id == sale.StoreId).Select(s => s.Name)).ToList();

                saleTable.CustomerName = names[0];
                saleTable.ProductName = names[1];
                saleTable.StoreName = names[2];
                saleTable.DateSold = sale.DateSold.ToString("dd-MM-yyyy");
                salesWithNavigationProperties.Add(saleTable);
            }
            
            return Json(salesWithNavigationProperties, JsonRequestBehavior.AllowGet);
        }

        // GET: Sales/Details/5
        public ActionResult Details(int? id)
        {
            SaleTable saleTable = new SaleTable();
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Sale sale = db.Sales.Find(id);            
            saleTable.Id = sale.Id;
            IList<string> names = db.Customers.Where(c => c.Id == sale.CustomerId).Select(c => c.Name)
                        .Concat(db.Products.Where(p => p.Id == sale.ProductId).Select(p => p.Name))
                        .Concat(db.Stores.Where(s => s.Id == sale.StoreId).Select(s => s.Name)).ToList();

            saleTable.CustomerName = names[0];
            saleTable.ProductName = names[1];
            saleTable.StoreName = names[2];
            saleTable.ProductId = sale.ProductId;
            saleTable.CustomerId = sale.CustomerId;
            saleTable.StoreId = sale.StoreId;
            saleTable.DateSold = sale.DateSold.ToString("dd-MM-yyyy");

            return Json(saleTable, JsonRequestBehavior.AllowGet);
        }
       

        // POST: Sales/Create        
        [HttpPost]
        public ActionResult Create([Bind(Include = "Id,ProductId,CustomerId,StoreId,DateSold")] Sale sale)
        {
            if (sale.Id == 0)
            {            
                db.Sales.Add(sale);
                db.SaveChanges();
                return Json(true, JsonRequestBehavior.AllowGet);
            }
            else
            {
                db.Entry(sale).State = EntityState.Modified;
                db.SaveChanges();
                return Json(true, JsonRequestBehavior.AllowGet);
            }

           
        }
        

        // POST: Sales/Edit/5

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,ProductId,CustomerId,StoreId,DateSold")] Sale sale)
        {
            if (ModelState.IsValid)
            {
                db.Entry(sale).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CustomerId = new SelectList(db.Customers, "Id", "Name", sale.CustomerId);
            ViewBag.ProductId = new SelectList(db.Products, "Id", "Name", sale.ProductId);
            ViewBag.StoreId = new SelectList(db.Stores, "Id", "Name", sale.StoreId);
            return View(sale);
        }

        

        // POST: Sales/Delete/5
        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {
            Sale sale = db.Sales.Find(id);
            db.Sales.Remove(sale);
            db.SaveChanges();
            return Json(true, JsonRequestBehavior.AllowGet);
        }

       
    }
}
