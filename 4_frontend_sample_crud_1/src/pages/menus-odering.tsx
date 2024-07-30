import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout";
import { Button, Container, Divider, NumberInput, TextInput, Textarea } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { Menu, CustomerOrder } from "../lib/models";

export default function MenuOrderPage() {
  const navigate = useNavigate();
  const { menuId } = useParams<{ menuId: string }>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [menu, setMenu] = useState<Menu & { totalPrice: number }>({ name: '', price: 0, description: '', totalPrice: 0 });

  const orderForm = useForm({
    initialValues: {
      customer_name: "",
      order_note: "",
      quantity: 1,
    },
    validate: {
      customer_name: isNotEmpty("กรุณาระบุชื่อของท่าน"),
      quantity: (value) => {
        if (value <= 0) {
          return "กรุณาระบุจำนวนที่ถูกต้อง(มากกว่า 0)";
        }
        return null;
      },
    },
  });

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await axios.get<Menu>(`/menus/${menuId}`);
        setMenu(response.data);
        setTotalPrice(response.data.price);
      } catch (error) {
        notifications.show({
          title: "เกิดข้อผิดพลาดในการดึงข้อมูลเมนู",
          message: "ไม่สามารถดึงข้อมูลเมนูได้ กรุณาลองใหม่อีกครั้ง",
          color: "red",
        });
      }
    };

    fetchMenuData();
  }, [menuId]);

  useEffect(() => {
    if (menu) {
      setTotalPrice(orderForm.values.quantity * menu.price);
    }
  }, [orderForm.values.quantity, menu]);

  const handleSubmit = async (values: typeof orderForm.values) => {
    try {
      setIsProcessing(true);
      const orderData: Omit<CustomerOrder, 'order_id'> = {
        menu_name: menu!.name,
        customer_name: values.customer_name,
        order_note: values.order_note,
        quantity: values.quantity,
        price: menu!.price,
        total_price: totalPrice,
      };
      await axios.post<CustomerOrder>(`/customer_orders`, orderData);
      notifications.show({
        title: "สั่งซื้อสำเร็จ",
        message: "การสั่งซื้อของท่านได้รับการบันทึกเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/menus`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          notifications.show({
            title: "ข้อมูลไม่ถูกต้อง",
            message: "กรุณาตรวจสอบข้อมูลที่กรอกใหม่อีกครั้ง",
            color: "red",
          });
        } else if (error.response?.status || 500 >= 500) {
          notifications.show({
            title: "เกิดข้อผิดพลาดบางอย่าง",
            message: "กรุณาลองใหม่อีกครั้ง",
            color: "red",
          });
        }
      } else {
        notifications.show({
          title: "เกิดข้อผิดพลาดบางอย่าง",
          message: "กรุณาลองใหม่อีกครั้ง หรือดูที่ Console สำหรับข้อมูลเพิ่มเติม",
          color: "red",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Layout>
        <Container className="mt-8">
          <h1 className="text-xl">สั่งซื้อเมนู</h1>
          {menu && (
            <form onSubmit={orderForm.onSubmit(handleSubmit)} className="space-y-8">
              <TextInput
                label="ชื่อเมนู"
                placeholder="ชื่อเมนู"
                value={menu.name}
                readOnly
              />
              <Textarea
                label="รายละเอียดเมนู"
                placeholder="รายละเอียดเมนู"
                value={menu.description}
                readOnly
              />
              <NumberInput
                label="จำนวน"
                placeholder="จำนวน"
                min={1}
                {...orderForm.getInputProps("quantity")}
              />
              <TextInput
                label="ราคาทั้งหมด"
                placeholder="ราคาทั้งหมด"
                value={totalPrice}
                readOnly
              />
              <TextInput
                label="ชื่อของท่าน"
                placeholder="ชื่อของท่าน"
                {...orderForm.getInputProps("customer_name")}
              />
              <Textarea
                label="Note to พนักงาน"
                placeholder="หมายเหตุถึงพนักงาน"
                {...orderForm.getInputProps("order_note")}
              />
              <Divider />
              <Button type="submit" loading={isProcessing}>
                บันทึกการสั่งซื้อ
              </Button>
            </form>
          )}
        </Container>
      </Layout>
    </>
  );
}
