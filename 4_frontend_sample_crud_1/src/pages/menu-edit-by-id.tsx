import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout";
import { Button, Container, Divider, NumberInput, TextInput, Textarea } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { Menu } from "../lib/models";

export default function MenuEditPage() {
  const navigate = useNavigate();
  const { menuId } = useParams<{ menuId: string }>();
  const [isProcessing, setIsProcessing] = useState(false);

  const menuEditForm = useForm({
    initialValues: {
      name: "",
      price: 50,
      description: "",
    },
    validate: {
      name: isNotEmpty("กรุณาระบุชื่อเมนู"),
      price: (value) => (value > 0 ? null : "กรุณาระบุราคาที่ถูกต้อง"),
      description: isNotEmpty("กรุณาระบุรายละเอียดเมนู"),
    },
  });

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await axios.get<Menu>(`/menus/${menuId}`);
        menuEditForm.setValues({
          name: response.data.name,
          price: response.data.price,
          description: response.data.description,
        });
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

  const handleSubmit = async (values: typeof menuEditForm.values) => {
    try {
      setIsProcessing(true);
      await axios.put<Menu>(`/menus/${menuId}`, values);
      notifications.show({
        title: "แก้ไขข้อมูลเมนูสำเร็จ",
        message: "ข้อมูลเมนูได้รับการแก้ไขเรียบร้อยแล้ว",
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
          <h1 className="text-xl">แก้ไขเมนู</h1>

          <form onSubmit={menuEditForm.onSubmit(handleSubmit)} className="space-y-8">
            <TextInput
              label="ชื่อเมนู"
              placeholder="ชื่อเมนู"
              {...menuEditForm.getInputProps("name")}
            />

            <NumberInput
              label="ราคา"
              placeholder="ราคา"
              min={0}
              {...menuEditForm.getInputProps("price")}
            />

            <Textarea
              label="รายละเอียดเมนู"
              placeholder="รายละเอียดเมนู"
              {...menuEditForm.getInputProps("description")}
            />

            <Divider />

            <Button type="submit" loading={isProcessing}>
              บันทึกข้อมูล
            </Button>
          </form>
        </Container>
      </Layout>
    </>
  );
}
