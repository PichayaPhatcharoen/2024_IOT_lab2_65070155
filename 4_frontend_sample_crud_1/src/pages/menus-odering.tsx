import useSWR from "swr";
import { Menu } from "../lib/models";
import { CustomerOrder } from "../lib/models";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout";
import { Alert, Button, Container, Divider, NumberInput, TextInput, Textarea } from "@mantine/core";
import Loading from "../components/loading";
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";

const fetchMenu = (url: string) => axios.get<Menu>(url).then(res => res.data);

export default function MenuEditById() {
  const { menuId } = useParams<{ menuId: string }>();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: menu, isLoading, error } = useSWR<Menu>(`/menus/${menuId}`, fetchMenu);
  const orderEditForm = useForm({
    initialValues: {
      customer_name: "",
      menu_name: "", 
      quantity: 1,
      total_price: 0,
      order_note: "",
    },
    validate: {
      customer_name: isNotEmpty("กรุณาระบุชื่อของท่าน"),
      quantity: (value) => (value > 0 ? null : "กรุณาระบุจำนวนที่ถูกต้อง"),
    },
  });
  useEffect(() => {
    if (menu) {
      orderEditForm.setValues({
        ...orderEditForm.values,
        menu_name: menu.name,
        total_price: menu.price * orderEditForm.values.quantity,
      });
    }
  }, [menu, orderEditForm.values.quantity]);

  const handleSubmit = async (values: typeof orderEditForm.values) => {
    try {
      setIsProcessing(true);
      await axios.post<CustomerOrder>("/customer_orders", {
        menu_name: values.menu_name,
        customer_name: values.customer_name,
        order_note: values.order_note,
        quantity: values.quantity,
        total_price: values.total_price,
      });
  
      notifications.show({
        title: "สั่งเครื่องดื่มสำเร็จ",
        message: "ได้รับออเดอร์เรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/menus`);
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
  
        if (status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลเมนู",
            message: "ไม่พบข้อมูลเมนูที่ต้องการสั่ง",
            color: "red",
          });
        } else if (status === 422) {
          notifications.show({
            title: "ข้อมูลไม่ถูกต้อง",
            message: "กรุณาตรวจสอบข้อมูลที่กรอกใหม่อีกครั้ง",
            color: "red",
          });
        } else if (status && status >= 500) {
          notifications.show({
            title: "เกิดข้อผิดพลาดบางอย่าง",
            message: "กรุณาลองใหม่อีกครั้ง",
            color: "red",
          });
        } else {
          notifications.show({
            title: "เกิดข้อผิดพลาดบางอย่าง",
            message: "กรุณาลองใหม่อีกครั้ง หรือดูที่ Console สำหรับข้อมูลเพิ่มเติม",
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
    <Layout>
      <Container className="mt-8">
        <h1 className="text-xl">แก้ไขออเดอร์ของคุณ</h1>

        {isLoading && !error && <Loading />}
        {error && (
          <Alert
            color="red"
            title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
            icon={<IconAlertTriangleFilled />}
          >
            {error.message}
          </Alert>
        )}

        {!!menu && (
          <form onSubmit={orderEditForm.onSubmit(handleSubmit)} method="post" className="space-y-8">
            <TextInput
              label="ชื่อเมนู"
              placeholder="ชื่อเมนู"
              value={orderEditForm.values.menu_name}
              readOnly
            />

            <NumberInput
              label="จำนวนแก้ว"
              placeholder="จำนวนแก้ว"
              min={1}
              {...orderEditForm.getInputProps("quantity")}
            />

            <NumberInput
              label="ราคารวม"
              placeholder="ราคา"
              value={orderEditForm.values.total_price}
              readOnly
            />

            <Textarea
              label="หมายเหตุถึงพนักงาน"
              placeholder="หมายเหตุถึงพนักงาน"
              {...orderEditForm.getInputProps("order_note")}
            />

            <Divider />

            <div className="flex justify-between">
              <Button type="submit" loading={isLoading || isProcessing}>
                ยืนยันส่งข้อมูลให้พนักงาน
              </Button>
            </div>
          </form>
        )}
      </Container>
    </Layout>
  );
}
