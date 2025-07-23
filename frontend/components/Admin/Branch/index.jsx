import { Button, Card, Form, Input, message, Popconfirm, Table } from "antd";
import Adminlayout from "../../Layout/Adminlayout"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {trimData,http} from "../../../modules/modules";
const {Item}=Form;
import { useEffect, useState } from "react";

const Branch = () => {
  //state collection
  const [branchFORM]=Form.useForm();
  const [loading,setLoadig]=useState(false);
  const [messageApi,context]=message.useMessage();
  const [allBranch,setAllBranch]=useState([]);
  const [no,setNo]=useState(0);
  const [edit,setEdit]=useState(null);

  // get app employee data
  useEffect(()=>{
   const fetcher=async()=>{
    try{
      const httpReq=http();
      const {data}=await httpReq.get("/api/branch");
      setAllBranch(data.data);
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
       finalObj.key=finalObj.branchName;
       console.log(finalObj);
       const httpReq=http();
    const {data}=await httpReq.post(`/api/branch`,finalObj);
      messageApi.success("Branch created");
      branchFORM.resetFields();
      setNo(no+1);
   }
   catch(err){
    if(err?.response?.data?.error?.code===11000){
      branchFORM.setFields([
        {
          name:"branchName",
          errors:["Branch already exists!"]
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

 
  //delete employee
  const onDeleteBranch=async (id)=>{
    try{
     const httpReq=http();
     await httpReq.delete(`/api/branch/${id}`);
      messageApi.success("Branch deleted successfully !");
      setNo(no+1);
    }
    catch(err){
      messageApi.error("Unable to delete branch !")
    }
  }

  //update employee
  const onEditBranch=async (obj)=>{
    setEdit(obj);
    branchFORM.setFieldsValue(obj);
  }

   const onUpdate=async (values)=>{
     try{
      setLoadig(false);
      let finalObj=trimData(values);
     const httpReq=http();
     await httpReq.put(`/api/branch/${edit._id}`,finalObj)
     messageApi.success("Branch updated successfully !");
     setNo(no+1);
     setEdit(null);
     branchFORM.resetFields();
     }
     catch(err){
    messageApi.error("Unable to update branch !")
     }
     finally{
      setLoadig(false);
     }
    
   }


// columns for table
    const columns=[
    {
        title:"Branch Name",
        dataIndex:"branchName",
        key:"branchName"
    },
    {
        title:"Branch Address",
        dataIndex:"branchAddress",
        key:"branchAddress"
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
          onConfirm={()=>onEditBranch(obj)
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
         onConfirm={() => onDeleteBranch(obj._id)}
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
        title="Add new branch">
            <Form 
            form={branchFORM}
            onFinish={edit ? onUpdate : onFinish}
            layout="vertical">
              
                <Item
                  name="branchName"
                  label="Branch name"
                   rules={[{required:true}]}>
                    <Input/>
                  </Item>

                 <Item
                  label="Branch address"
                  name="branchAddress"
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
         title="Branch list"
         style={{overflowX:"auto"}}
         >
            <Table
            columns={columns}
            dataSource={allBranch}
            scroll={{x:"max-content"}}>

            </Table>
         </Card>
    </h1>
   </Adminlayout>
  )
}

export default Branch;
