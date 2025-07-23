import { Button, Card, Form, Input, message, Popconfirm, Table } from "antd";
import Adminlayout from "../../Layout/Adminlayout"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {trimData,http} from "../../../modules/modules";
const {Item}=Form;
import { useEffect, useState } from "react";
import { useTheme } from "../../Layout/Theme/ThemeContext";

const Currency = () => {
  //state collection
  const [currencyFORM]=Form.useForm();
  const [loading,setLoadig]=useState(false);
  const [messageApi,context]=message.useMessage();
  const [allCurrency,setAllCurrency]=useState([]);
  const [no,setNo]=useState(0);
  const [edit,setEdit]=useState(null);

    // ✅ Theme
  const { darkMode } = useTheme();
  const theme = {
    background: darkMode ? "#141414" : "#fff",
    text: darkMode ? "#fff" : "#000",
    cardBg: darkMode ? "#1f1f1f" : "#fff",
    border: darkMode ? "1px solid #303030" : "1px solid #f0f0f0",
  };


  // get app employee data
  useEffect(()=>{
   const fetcher=async()=>{
    try{
      const httpReq=http();
      const {data}=await httpReq.get("/api/currency");
      setAllCurrency(data.data);
    }
    catch(err){
      messageApi.error("Unable to fetch data!")
    }
   }
   fetcher();
  },[no])
  // cretae new employee
  const onFinish= async (values)=>{
     try{
      setLoadig(true);
       let finalObj=trimData(values);
       finalObj.key=finalObj.currencyName;
       console.log(finalObj);
       const httpReq=http();
    const {data}=await httpReq.post(`/api/currency`,finalObj);
      messageApi.success("Currency created");
      currencyFORM.resetFields();
      setNo(no+1);
   }
   catch(err){
    if(err?.response?.data?.error?.code===11000){
      currencyFORM.setFields([
        {
          name:"currencyName",
          errors:["Currency already exists!"]
        }
      ])
    }
    else{
      messageApi.error("Try again later");
    }
   }
   finally{
    setLoadig(false);
   }
  }



  //update employee
  const onEditCurrency=async (obj)=>{
    setEdit(obj);
    currencyFORM.setFieldsValue(obj);
  }

   const onUpdate=async (values)=>{
     try{
      setLoadig(false);
      let finalObj=trimData(values);
     const httpReq=http();
     await httpReq.put(`/api/currency/${edit._id}`,finalObj)
     messageApi.success("Currency updated successfully !");
     setNo(no+1);
     setEdit(null);
     currencyFORM.resetFields();
     }
     catch(err){
    messageApi.error("Unable to update currency !")
     }
     finally{
      setLoadig(false);
     }
    
   }

     //delete employee
  const onDeleteCurrency=async (id)=>{
    try{
     const httpReq=http();
     await httpReq.delete(`/api/currency/${id}`);
      messageApi.success("Currency deleted successfully !");
      setNo(no+1);
    }
    catch(err){
      messageApi.error("Unable to delete currency !")
    }
  }


// columns for table
    const columns=[
    {
        title:"Currency Name",
        dataIndex:"currencyName",
        key:"currencyName"
    },
    {
        title:"Currency Description",
        dataIndex:"currencyDesc",
        key:"currencyDesc"
    },
    {
        title:"Action",
        key:"action",
        fixed:"right",
        render : (_,obj) =>(
         <div className="flex gap-1">
         

          <Popconfirm
          title="Are you sure ?"
          description="Once you update,you can also re-update !"
          onCancel={()=>messageApi.info("No changes occur !")
          }
          onConfirm={()=>onEditCurrency(obj)
          }
          >
            <Button
            type="text"
            className="!bg-green-100 !text-green-500"
            icon={<EditOutlined/>}>
            </Button>
          </Popconfirm>
          
            <Popconfirm
             title="Are you sure ?"
          description="Once you deleted,you can not re-store !"
          onCancel={()=>messageApi.info("your data is safe !")
          }
         onConfirm={() => onDeleteCurrency(obj._id)}
            > <Button
            type="text"
            className="!bg-pink-100 !text-pink-500"
            icon={<DeleteOutlined/>}>
            </Button></Popconfirm>

        
         </div>
        )
        
    }
    
]
  return (
   <Adminlayout>
    {context}
    <h1 className="grid md:grid-cols-3 gap-3">
        <Card
        title="Add new currency">
            <Form 
            form={currencyFORM}
            onFinish={edit ? onUpdate : onFinish}
            layout="vertical">
              
                <Item
                  name="currencyName"
                  label="Currency name"
                   rules={[{required:true}]}>
                    <Input/>
                  </Item>

                 <Item
                  label="Currency description"
                  name="currencyDesc"
                  >
                    <Input.TextArea/>
                  </Item>
                  <Item>
                    {
                      edit ?
                      <Button
                    loading={loading}
                    type="text"
                    htmlType="submit"
                    className="!bg-rose-500 !text-white !font-bold !w-full"
                    >
                     Update
                    </Button>
                    :
                    <Button
                    loading={loading}
                    type="text"
                    htmlType="submit"
                    className="!bg-blue-500 !text-white !font-bold !w-full"
                    >
                     Submit
                    </Button>
                    }
                  </Item>
            </Form>
        </Card>


         <Card className="md:col-span-2"
         title="Currency list"
         style={{overflowX:"auto"}}
         >
            <Table
            columns={columns}
            dataSource={allCurrency}
            scroll={{x:"max-content"}}>

            </Table>
         </Card>
    </h1>
   </Adminlayout>
  )
}

export default Currency;
