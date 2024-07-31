import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-3.jpg";
import useSWR from "swr";
import { CustomerOrder } from "../lib/models";
// import Loading from "../components/loading";
import { Alert, Button } from "@mantine/core";
// import { IconAlertTriangleFilled, IconPlus } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function MenuPage() {
    const { data: orders, error } = useSWR<CustomerOrder[]>("/customer_orders");
    {!orders && !error && <Loading />}
                {error && (
                    <Alert
                        color="red"
                        title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
                        icon={<IconAlertTriangleFilled />}
                    >
                        {error.message}
                    </Alert>
                )}
    
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
                        
                        <table>
                            <tr>
                                <th>order id</th>
                                <th>customer name</th>
                                <th>Menu</th>
                                <th>จำนวนแก้ว</th>
                                <th>ราคารวม</th>
                                <th>ลบรายการ</th>
                                {orders?.map((order) => (
                                    <td>{order.order_id}</td>
                                    <td>{order.customer_name}</td>
                                    <td>{order.menu_name}</td>
                                    <td>{order.quantity}</td>
                                    <td>{order.total_price}</td>
                                    <button>ลบ</button>
                                )
                                
                            </tr>
                        </table>
                        
                        // <div className="border border-solid border-neutral-200" key={menu.id}>
                        //     <img
                        //         src="https://placehold.co/150x200"
                        //         alt={menu.name}
                        //         className="w-full object-cover aspect-[3/4]"
                        //     />
                        //     <div className="p-4">
                        //         <h2 className="text-lg font-semibold line-clamp-2">{menu.name}</h2>
                        //         <p className="text-xs text-neutral-500">ราคา: ${menu.price}</p>
                        //         <p className="text-xs text-neutral-500">{menu.description}</p>
                        //     </div>

                        //     <div className="flex justify-end px-4 pb-2">
                        //         <Button component={Link} to={`/menu/ordering/${menu.id}`} size="xs" variant="default">
                        //             สั่งเครื่องดื่ม
                        //         </Button>
                        //     </div>
                        // </div>
                    
                </div>

            </section>
        </Layout>
    );
}
