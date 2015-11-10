using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;



[DataContract]
public class OrderDetail : Order
{
    [DataMember]
    public List<Item> Items { get; set; }
     [DataMember]
    public double Total { get; set; }

}

[DataContract]
public class Item
{
    [DataMember]
    public string Name { get; set; }
    [DataMember]
    public double Price { get; set; }
    [DataMember]
    public double Quantity { get; set; }
    [DataMember]
    public double Weight { get; set; }
    [DataMember]
    public double Total { get; set; }
}

[DataContract]
public class Order
{
    [DataMember]
    public Guid OrderID { get; set; }
    [DataMember]
    public string OrderName { get; set; }
    [DataMember]
    public DateTime OrderDate { get; set; }
}
