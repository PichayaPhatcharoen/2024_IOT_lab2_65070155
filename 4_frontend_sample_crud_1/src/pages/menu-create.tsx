import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import { Button, Container, Divider, NumberInput, TextInput, Textarea } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useState } from "react";
import axios from "axios";
import { notifications } from "@mantine/notifications";

export default function MenuCreatePage() {
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  const menuCreateForm = useForm({
    initialValues: {
      name: "",
      price: 0,
      description: "",
    },

    validate: {
      name: isNotEmpty("กรุณาระบุชื่อเมนู"),
      price: (value) => (value > 0 ? null : "กรุณาระบุราคาที่ถูกต้อง"),
      description: isNotEmpty("กรุณาระบุรายละเอียดเมนู"),
    },
  });

  const handleSubmit = async (values: typeof menuCreateForm.values) => {
    try {
      setIsProcessing(true);
      await axios.post("/menus", values);
      notifications.show({
        title: "เพิ่มข้อมูลเมนูสำเร็จ",
        message: "ข้อมูลเมนูถูกเพิ่มเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/menus`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Layout>
        <Container className="mt-8">
          <h1 className="text-xl">เพิ่มเมนูในระบบ</h1>

          <form onSubmit={menuCreateForm.onSubmit(handleSubmit)} className="space-y-8">
            <TextInput
              label="ชื่อเมนู"
              placeholder="ชื่อเมนู"
              {...menuCreateForm.getInputProps("name")}
            />

            <NumberInput
              label="ราคา"
              placeholder="ราคา"
              min={0}
              {...menuCreateForm.getInputProps("price")}
            />

            <Textarea
              label="รายละเอียดเมนู"
              placeholder="รายละเอียดเมนู"
              {...menuCreateForm.getInputProps("description")}
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
