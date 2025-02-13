import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-3.jpg";
import useSWR from "swr";
import { Menu } from "../lib/models";
import Loading from "../components/loading";
import { Alert, Button } from "@mantine/core";
import { IconAlertTriangleFilled, IconPlus } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function MenuPage() {
    const { data: menus, error } = useSWR<Menu[]>("/menus");

    return (
        <Layout>
            <section
                className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
                style={{
                    backgroundImage: `url(${cafeBackgroundImage})`,
                }}
            >
                <h1 className="text-5xl mb-2">เมนูเครื่องดื่ม</h1>
                <h2>รายการเครื่องดื่มทั้งหมด</h2>
                <h2>คุณสามารถสั่งเครื่องดื่มได้ที่นี่</h2>
            </section>

            <section className="container mx-auto py-8">
                <div className="flex justify-between">
                    <h1>รายการเมนูเครื่องดื่ม</h1>

                    <div className="grid grid-cols-3">
                        <Button component={Link}
                            leftSection={<IconPlus />}
                            to="/menus/create"
                            size="xs"
                            variant="primary"
                            className="flex items-center space-x-2 mr-5"
                        >
                            เพิ่มเมนู
                        </Button>
                        <Button component={Link}
                            to="/menus/edit"
                            size="xs"
                            variant="primary"
                            className="flex items-center space-x-2 mr-5"
                        >
                            แก้ไขเมนู
                        </Button>
                        <Button component={Link}
                            to="/menus/cus_orders"
                            size="xs"
                            variant="primary"
                            className="flex items-center space-x-2 mr-5"
                        >
                            ดูคำสั่งซื้อลูกค้า
                        </Button>
                    </div>
                </div>

                {!menus && !error && <Loading />}
                {error && (
                    <Alert
                        color="red"
                        title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
                        icon={<IconAlertTriangleFilled />}
                    >
                        {error.message}
                    </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {menus?.map((menu) => (
                        <div className="border border-solid border-neutral-200" key={menu.id}>
                            <img
                                src="https://placehold.co/150x200"
                                alt={menu.name}
                                className="w-full object-cover aspect-[3/4]"
                            />
                            <div className="p-4">
                                <h2 className="text-lg font-semibold line-clamp-2">{menu.name}</h2>
                                <p className="text-xs text-neutral-500">ราคา: ${menu.price}</p>
                                <p className="text-xs text-neutral-500">{menu.description}</p>
                            </div>

                            <div className="flex justify-end px-4 pb-2">
                                <Button component={Link} to={`/menu/ordering/${menu.id}`} size="xs" variant="default">
                                    สั่งเครื่องดื่ม
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </Layout>
    );
}
