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
    public class StoresController : Controller
    {
        private OnboardingTaskEntities1 db = new OnboardingTaskEntities1();

        // GET: Stores
        public ActionResult Index()
        {
            return View(db.Stores.ToList());
        }

        public JsonResult getAllStores()
        {
            IList<Store> storeList = new List<Store>();           
            var store = db.Stores.ToList();
            return Json(store, JsonRequestBehavior.AllowGet);
        }

        // GET: Stores/Details/5
        public JsonResult Details(int? id)
        {
            if (id == null)
            {
                return Json(false, JsonRequestBehavior.AllowGet);
            }
            else
            {
                Store store = db.Stores.Find(id);
                return Json(store, JsonRequestBehavior.AllowGet);
            }
        }

        // GET: Stores/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Stores/Create
        [HttpPost]
        public JsonResult Create([Bind(Include = "Id,Name,Address")] Store store)
        {
            if (store.Id == 0)  //ModelState.IsValid
            {
                db.Stores.Add(store);
                db.SaveChanges();
                return Json(true, JsonRequestBehavior.AllowGet);
            }
            else
            {
                db.Entry(store).State = EntityState.Modified;
                db.SaveChanges();
                return Json(true, JsonRequestBehavior.AllowGet);
            }

           
        }

        // POST: Stores/Delete/5
        [HttpPost, ActionName("Delete")]
        public JsonResult DeleteConfirmed(int id)
        {
            Store store = db.Stores.Find(id);
            db.Stores.Remove(store);
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
