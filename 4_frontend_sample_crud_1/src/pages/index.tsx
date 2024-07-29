import React from 'react';
import Layout from './Layout';
import cafeBackgroundImage from './path/to/cafeBackgroundImage.jpg';
import ajPanwitImage from './path/to/ajPanwitImage.jpg';
import myimg from './path/to/myimg.jpg';
import coffeeImage from './path/to/coffeeImage.jpg';

export default function HomePage() {
  return (
    <Layout>
      <section
        className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
        style={{
          backgroundImage: `url(${cafeBackgroundImage})`,
        }}
      >
        <h1 className="text-5xl mb-2">ยินดีต้อนรับสู่ IoT Library & Cafe</h1>
        <h2>ร้านกาแฟที่มีหนังสืออยู่นิดหน่อยให้คุณได้อ่าน</h2>
      </section>

      <section className="container mx-auto py-8">
        <h1>เกี่ยวกับเรา</h1>

        <div className="grid grid-cols-3 gap-4">
          <p className="text-left col-span-2">
            IoT Library & Cafe เป็นร้านกาแฟที่มีหนังสืออยู่นิดหน่อยให้คุณได้อ่าน
            และเรียนรู้เรื่องใหม่ๆ ที่เกี่ยวกับเทคโนโลยี IoT โดยคาเฟ่ของเรานั้น ก่อตั้งขึ้นโดย
            ผศ.ดร. ปานวิทย์ ธุวะนุติ ซึ่งเป็นอาจารย์ในวิชา Internet of Things และนายกฤตณัฏฐ์
            ศิริพรนพคุณ เป็นผู้ช่วยสอนในหัวข้อ FastAPI และ React ในวิชานี้
          </p>

          <div>
            <img src={ajPanwitImage} alt="Panwit Tuwanut" className="h-full w-full object-cover" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <img src={myimg} alt="65070155 Pichaya Phatcharoen" className="h-full w-full object-cover" />
          </div>
          <p className="text-right mt-8">
            ปัจจุบันค่าเฟ่ และห้องสมุดของเรา อยู่ในช่วงการดูแลของ 
            {" นางสาวพิชญา พัฒน์เจริญ รหัสนักศึกษา 65070155 "} นักศึกษาชั้นปีที่ 3 สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง 
            โดยร้านของเรามีบริการต่าง ๆ ไม่ว่าจะเป็นบริการสั่งเครื่องดื่มในระหว่างเลือกดูข้อมูลหนังสือของคุณ เพื่อให้คุณสามารถ enjoy กับการอ่านได้อย่างเต็มที่
          </p>
        </div>
        <div className="w-full">
          <p className="text-right">สามารถติดต่อได้ทาง EMAIL : 65070155@kmitl.ac.th</p>
        </div>
      </section>

      <section className="w-full flex justify-center">
        <img src={coffeeImage} alt="Coffee" className="w-full" />
      </section>
    </Layout>
  );
}
