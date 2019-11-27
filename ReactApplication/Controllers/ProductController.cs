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

        
        public ActionResult Index()
        {
            return View(db.Products.ToList());
        }

        // GET: Product list
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

        // POST: Product/Create
        [HttpPost]
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
        public JsonResult DeleteConfirmed(int id)
        {
            Product product = db.Products.Find(id);
            db.Products.Remove(product);
            db.SaveChanges();
            return Json(true, JsonRequestBehavior.AllowGet);
        }

    }
}
