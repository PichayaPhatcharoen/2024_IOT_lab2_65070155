// import { useNavigate, useParams } from "react-router-dom";
// import Layout from "../components/layout";
// import { Button, Container, Divider, NumberInput, TextInput, Textarea } from "@mantine/core";
// import { isNotEmpty, useForm } from "@mantine/form";
// import { useState, useEffect } from "react";
// import axios, { AxiosError } from "axios";
// import { notifications } from "@mantine/notifications";
// import { Menu, CustomerOrder } from "../lib/models";

// export default function MenuOrderPage() {
//   const navigate = useNavigate();
//   const { menuId } = useParams<{ menuId: string }>();
//   const [menu, setMenu] = useState<Menu | null>(null);
//   const [totalPrice, setTotalPrice] = useState<number>(0);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const orderForm = useForm({
//     initialValues: {
//       customer_name: "",
//       order_note: "",
//       quantity: 1,
//     },
//     validate: {
//       customer_name: isNotEmpty("กรุณาระบุชื่อของท่าน"),
//       quantity: (value) => (value > 0 ? null : "กรุณาระบุจำนวนที่ถูกต้อง"),
//     },
//   });

//   useEffect(() => {
//     const fetchMenuData = async () => {
//       try {
//         const response = await axios.get<Menu>(`/menus/${menuId}`);
//         setMenu(response.data);
//       } catch (error) {
//         notifications.show({
//           title: "เกิดข้อผิดพลาดในการดึงข้อมูลเมนู",
//           message: "ไม่สามารถดึงข้อมูลเมนูได้ กรุณาลองใหม่อีกครั้ง",
//           color: "red",
//         });
//       }
//     };

//     fetchMenuData();
//   }, [menuId]);

//   useEffect(() => {
//     if (menu) {
//       setTotalPrice(menu.price * orderForm.values.quantity);
//     }
//   }, [orderForm.values.quantity, menu]);

//   const handleSubmit = async (values: typeof orderForm.values) => {
//     try {
//       setIsProcessing(true);
//       const orderData: Omit<CustomerOrder, 'order_id'> = {
//         menu_name: menu!.name,
//         customer_name: values.customer_name,
//         order_note: values.order_note,
//         quantity: values.quantity,
//         price: menu!.price,
//         total_price: totalPrice,
//       };

//       await axios.post<CustomerOrder>("/customer_orders", orderData);

//       notifications.show({
//         title: "สั่งเมนูสำเร็จ",
//         message: "ข้อมูลการสั่งซื้อของท่านได้รับการบันทึกเรียบร้อยแล้ว",
//         color: "teal",
//       });
//       navigate(`/menus`);
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         if (error.response?.status === 422) {
//           notifications.show({
//             title: "ข้อมูลไม่ถูกต้อง",
//             message: "กรุณาตรวจสอบข้อมูลที่กรอกใหม่อีกครั้ง",
//             color: "red",
//           });
//         } else if (error.response?.status || 500 >= 500) {
//           notifications.show({
//             title: "เกิดข้อผิดพลาดบางอย่าง",
//             message: "กรุณาลองใหม่อีกครั้ง",
//             color: "red",
//           });
//         }
//       } else {
//         notifications.show({
//           title: "เกิดข้อผิดพลาดบางอย่าง",
//           message: "กรุณาลองใหม่อีกครั้ง หรือดูที่ Console สำหรับข้อมูลเพิ่มเติม",
//           color: "red",
//         });
//       }
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <Layout>
//       <Container className="mt-8">
//         <h1 className="text-xl">สั่งเมนู</h1>

//         <form onSubmit={orderForm.onSubmit(handleSubmit)} className="space-y-8">
//           <TextInput
//             label="ชื่อเมนู"
//             placeholder="ชื่อเมนู"
//             value={menu?.name || ""}
//             readOnly
//           />

//           <Textarea
//             label="รายละเอียดเมนู"
//             placeholder="รายละเอียดเมนู"
//             value={menu?.description || ""}
//             readOnly
//           />

//           <NumberInput
//             label="จำนวน"
//             placeholder="จำนวน"
//             min={1}
//             {...orderForm.getInputProps("quantity")}
//           />

//           <NumberInput
//             label="ราคารวม"
//             placeholder="ราคารวม"
//             value={totalPrice}
//             readOnly
//           />

//           <TextInput
//             label="ชื่อของท่าน"
//             placeholder="ชื่อของท่าน"
//             {...orderForm.getInputProps("customer_name")}
//           />

//           <Textarea
//             label="หมายเหตุถึงพนักงาน"
//             placeholder="หมายเหตุถึงพนักงาน"
//             {...orderForm.getInputProps("order_note")}
//           />

//           <Divider />

//           <Button type="submit" loading={isProcessing}>
//             บันทึกการสั่งซื้อ
//           </Button>
//         </form>
//       </Container>
//     </Layout>
//   );
// }
