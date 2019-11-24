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
    public class CustomerController : Controller
    {
        private OnboardingTaskEntities1 db = new OnboardingTaskEntities1();

        // GET: Customer
        public ActionResult Index()
        {
            return View(db.Customers.ToList());
        }

        public JsonResult getAllCustomer()
        {
            IList<Customer> customerList = new List<Customer>();
            customerList = db.Customers.ToList();
            return Json(customerList, JsonRequestBehavior.AllowGet);
        }

        // GET: Customer/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Customer customer = db.Customers.Find(id);
            if (customer == null)
            {
                return HttpNotFound();
            }
            return View(customer);
        }

        // GET: Customer/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Customer/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
   //     [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,Name,Address")] Customer customer)
        {
            if (customer.Id == 0)
            {
                db.Customers.Add(customer);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            else
            {
                db.Entry(customer).State = EntityState.Modified;
                db.SaveChanges();
            }

            return View(customer);
        }

        // GET: Customer/Edit/5
        public JsonResult Edit(int? id)
        {
            if (id == null)
            {
                return  Json(false, JsonRequestBehavior.AllowGet);
            }
            else
            {
                Customer customer = db.Customers.Find(id);
                return Json(customer, JsonRequestBehavior.AllowGet);
            }
            
        }
       

        // POST: Customer/Delete/5
        [HttpPost, ActionName("Delete")]
  //      [ValidateAntiForgeryToken]
        public JsonResult DeleteConfirmed(int id)
        {
            Customer customer = db.Customers.Find(id);
            db.Customers.Remove(customer);
            db.SaveChanges();
            return Json(true, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public String Check(Customer cust)
        {
            

            return cust.Name;
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
