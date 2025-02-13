import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-3.jpg";
import useSWR, { mutate } from "swr";
import { CustomerOrder } from "../lib/models";
import Loading from "../components/loading";
import { Alert, Button, Modal } from "@mantine/core";
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import { useState } from "react";
import axios, { AxiosError } from 'axios';
import { showNotification } from "@mantine/notifications";

export default function OrderPage() {
    const { data: orders, error } = useSWR<CustomerOrder[]>("/customer_orders");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

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
                    {(error as Error).message}
                </Alert>
            </Layout>
        );
    }

    const orderList = orders || [];

    const handleDeleteClick = (orderId: number) => {
        setOrderToDelete(orderId);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (orderToDelete !== null) {
            try {
                setIsProcessing(true);
                await axios.delete(`/customer_orders/${orderToDelete}`);
                
                showNotification({
                    title: 'สำเร็จ',
                    message: 'ลบรายการสำเร็จ',
                    color: 'green',
                });
                mutate('/customer_orders');
            } catch (error) {
                if (error instanceof AxiosError) {
                    if (error.response?.status === 404) {
                        showNotification({
                            title: 'ไม่พบรายการ',
                            message: 'ไม่พบรายการที่ต้องการลบ',
                            color: 'red',
                        });
                    } else {
                        showNotification({
                            title: 'ข้อผิดพลาด',
                            message: 'ข้อมูลไม่ถูกต้อง โปรดลองอีกครั้ง',
                            color: 'red',
                        });
                    }
                } else {
                    showNotification({
                        title: 'ข้อผิดพลาด',
                        message: 'เกิดข้อผิดพลาดไม่คาดคิด',
                        color: 'red',
                    });
                }
            } finally {
                setDeleteModalOpen(false);
                setOrderToDelete(null);
                setIsProcessing(false);
            }
        }
    };

    return (
        <Layout>
            <section
                className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
                style={{
                    backgroundImage: `url(${cafeBackgroundImage})`,
                }}
            >
                <h1 className="text-5xl mb-2">Customer Orders</h1>
                <h2>รายการออเดอร์ลูกค้า</h2>
            </section>
            <div className="flex justify-center">
                <table className="min-w-full bg-white text-black border border-gray-200">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Order id.</th>
                            <th className="py-2 px-4 border-b">Customer Name</th>
                            <th className="py-2 px-4 border-b">Menu</th>
                            <th className="py-2 px-4 border-b">Note</th>
                            <th className="py-2 px-4 border-b">Quantity</th>
                            <th className="py-2 px-4 border-b">Total Price</th>
                            <th className="py-2 px-4 border-b">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderList.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-4">ไม่มีรายการออเดอร์</td>
                            </tr>
                        ) : (
                            orderList.map((order) => (
                                <tr key={order.order_id}>
                                    <td className="py-2 px-4 border-b text-center">{order.order_id}</td>
                                    <td className="py-2 px-4 border-b text-center">{order.customer_name}</td>
                                    <td className="py-2 px-4 border-b text-center">{order.menu_name}</td>
                                    <td className="py-2 px-4 border-b text-center">{order.order_note}</td>
                                    <td className="py-2 px-4 border-b text-center">{order.quantity}</td>
                                    <td className="py-2 px-4 border-b text-center">{order.total_price} $</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        <Button
                                            color="red"
                                            onClick={() => handleDeleteClick(order.order_id)}
                                            radius="md"
                                            className="flex items-center"
                                        >
                                            <span className="">ลบ</span>
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                opened={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Confirm Deletion"
            >
                <p>ต้องการลบรายการออเดอร์นี้หรือไม่?</p>
                <div className="flex justify-end mt-4">
                    <Button variant="outline" onClick={() => setDeleteModalOpen(false)} className="mr-2">
                        Cancel
                    </Button>
                    <Button color="red" onClick={handleDelete} loading={isProcessing}>
                        Delete
                    </Button>
                </div>
            </Modal>
        </Layout>
    );
}
