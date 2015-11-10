using System;
using System.Activities.Expressions;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using System.Web.Script.Serialization;

namespace RusWizards
{
    [ServiceContract(Namespace = "")]
    [AspNetCompatibilityRequirements(RequirementsMode= AspNetCompatibilityRequirementsMode.Allowed)]
    public class RestoranAjax
    {
        [WebGet]
        [OperationContract]
        public OrderDetail GetOrderDetail(Guid orderID)
        {
            //Передаем описание заказа
            var data = GetJsonOrders();
            var orders = new JavaScriptSerializer().Deserialize<List<OrderDetail>>(data);
            var order = (from p in orders
                where p.OrderID == orderID
                select p).FirstOrDefault();
            return order;
        }
        [WebGet]
        [OperationContract]
        public IEnumerable<Order> GetListOrders()
        {
            var data = GetJsonOrders();
            var orders = new JavaScriptSerializer().Deserialize<List<OrderDetail>>(data);
            var result = (from p in orders
                select new Order()
                {
                    OrderID = p.OrderID,
                    OrderDate = p.OrderDate,
                    OrderName = p.OrderName,
                });
           //Передаем только то, что нужно
           //
            return result;
        }

        private string GetJsonOrders()
        {
           //Читает JSON
            var basepath = System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath;
            var filename = Path.Combine(basepath, "Orders.json");
            var data = File.ReadAllText(filename);
            return data;

        }
    }
}