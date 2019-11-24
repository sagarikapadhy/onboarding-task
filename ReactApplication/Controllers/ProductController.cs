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
    public class ProductController : Controller
    {
        private OnboardingTaskEntities1 db = new OnboardingTaskEntities1();

        // GET: Product
        public ActionResult Index()
        {
            return View(db.Products.ToList());
        }

        public JsonResult getAllProducts()
        {
            IList<Product> productsList = new List<Product>();
            productsList = db.Products.ToList();
            return Json(productsList, JsonRequestBehavior.AllowGet);
        }

        // GET: Product/Details/5
        public JsonResult Details(int? id)
        {
            if (id == null)
            {
                return Json(false, JsonRequestBehavior.AllowGet);
            }
            else
            {
                Product product = db.Products.Find(id);
                return Json(product, JsonRequestBehavior.AllowGet);
            }
        }

        // GET: Product/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Product/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
  //      [ValidateAntiForgeryToken]
        public JsonResult Create([Bind(Include = "Id,Name,Price")] Product product)
        {
              if (product.Id == 0)
              {
                db.Products.Add(product);
                db.SaveChanges();
                return Json(true, JsonRequestBehavior.AllowGet);
            }
            else
            {
                db.Entry(product).State = EntityState.Modified;
                db.SaveChanges();
                return Json(true, JsonRequestBehavior.AllowGet);
            }
            
        }      

        // POST: Product/Delete/5
        [HttpPost, ActionName("Delete")]
 //       [ValidateAntiForgeryToken]
        public JsonResult DeleteConfirmed(int id)
        {
            Product product = db.Products.Find(id);
            db.Products.Remove(product);
            db.SaveChanges();
            return Json(true, JsonRequestBehavior.AllowGet);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
