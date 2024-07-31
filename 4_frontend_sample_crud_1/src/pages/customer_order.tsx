import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-3.jpg";
import useSWR from "swr";
import { CustomerOrder } from "../lib/models";
// import Loading from "../components/loading";
import { Alert, Button } from "@mantine/core";
// import { IconAlertTriangleFilled } from "@tabler/icons-react";
// import { Link } from "react-router-dom";

export default function MenuPage() {
    const { data: orders, error } = useSWR<CustomerOrder[]>("/customer_orders");

    if (!orders && !error) {
        return <Loading />;
    }

    if (error) {
        return (
            <Layout>
                <Alert
                    color="red"
                    title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
                    icon={<IconAlertTriangleFilled />}
                >
                    {error.message}
                </Alert>
            </Layout>
        );
    }

    return (
        <Layout>
            <section
                className="h-full w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
                style={{
                    backgroundImage: `url(${cafeBackgroundImage})`,
                }}
            >
                <h1 className="text-5xl mb-2">Customer Orders</h1>
                <h2>รายการออเดอร์ลูกค้า</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <table className="min-w-full bg-white text-black">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer Name</th>
                                <th>Menu</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.order_id}>
                                    <td>{order.order_id}</td>
                                    <td>{order.customer_name}</td>
                                    <td>{order.menu_name}</td>
                                    <td>{order.quantity}</td>
                                    <td>{order.total_price}</td>
                                    <td>
                                        <button>ลบ</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </Layout>
    );
}
