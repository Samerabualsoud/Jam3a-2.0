
import React, { useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Eye, 
  PackageCheck, 
  TruckIcon, 
  Check 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const OrdersManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock order data
  const [orders, setOrders] = useState([
    { 
      id: "ORD-001", 
      customer: "John Doe", 
      date: "2023-06-15", 
      total: 1299, 
      status: "Processing", 
      items: 3 
    },
    { 
      id: "ORD-002", 
      customer: "Jane Smith", 
      date: "2023-06-18", 
      total: 699, 
      status: "Shipped", 
      items: 2 
    },
    { 
      id: "ORD-003", 
      customer: "Robert Johnson", 
      date: "2023-06-20", 
      total: 2499, 
      status: "Delivered", 
      items: 4 
    },
    { 
      id: "ORD-004", 
      customer: "Sarah Williams", 
      date: "2023-06-25", 
      total: 349, 
      status: "Processing", 
      items: 1 
    },
    { 
      id: "ORD-005", 
      customer: "Michael Brown", 
      date: "2023-06-28", 
      total: 1899, 
      status: "Pending", 
      items: 5 
    },
  ]);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
      case "Shipped":
        return <Badge className="bg-blue-500 hover:bg-blue-600">{status}</Badge>;
      case "Processing":
        return <Badge className="bg-orange-500 hover:bg-orange-600">{status}</Badge>;
      case "Pending":
        return <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusActions = (order) => {
    switch (order.status) {
      case "Pending":
        return (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => updateOrderStatus(order.id, "Processing")}
          >
            <Check className="mr-1 h-3 w-3" /> Accept
          </Button>
        );
      case "Processing":
        return (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => updateOrderStatus(order.id, "Shipped")}
          >
            <TruckIcon className="mr-1 h-3 w-3" /> Ship
          </Button>
        );
      case "Shipped":
        return (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => updateOrderStatus(order.id, "Delivered")}
          >
            <PackageCheck className="mr-1 h-3 w-3" /> Deliver
          </Button>
        );
      default:
        return null;
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Orders Management</h2>
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="flex justify-end items-center gap-2">
                    {getStatusActions(order)}
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersManager;
