import Layout from "../components/layout";
export default function MenuPage() {
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
        </Layout>
    );
}