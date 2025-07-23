import {
  Button,
  Card,
  message,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Table,
  Image,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import {
  http,
  uploadFile,
  trimData,
  fetchData,
} from "../../../modules/modules";
import useSWR, { mutate } from "swr";

const { Item } = Form;

const NewAccount = () => {
  //getInfo  from sessionStorage
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

  const [accountForm] = Form.useForm();
  const [messageApi, context] = message.useMessage();

  //states collections
  const [accountModal, setAccountModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [signature, setSignature] = useState(null);
  const [document, setDocument] = useState(null);
  const [no, setNo] = useState(0);
  const [allCustomer, setAllCustome] = useState(null);
  const [finalCustomer, setFinalCustome] = useState(null);
    const [edit,setEdit]=useState(null);

  //get branding details
  const { data: brandings, error: bError } = useSWR(
    "/api/branding",
    fetchData,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 1200000,
    }
  );

  // get all customer data
  useEffect(() => {
    const fetcher = async () => {
      try {
        const httpReq = http();
        const { data } = await httpReq.get("/api/customers");
        setAllCustome(data?.data.filter((item)=>item.branch==userInfo.branch));
          setFinalCustome(data?.data.filter((item)=>item.branch==userInfo.branch));
      } catch (err) {
        messageApi.error("Unable to fetch data!");
      }
    };
    fetcher();
  }, [no]);



  let bankAccountNo = Number(brandings?.data[0]?.bankAccountNo) + 1;
  let brandingId = brandings && brandings?.data[0]?._id;
  accountForm.setFieldValue("accountNo", bankAccountNo);

  // cretae new account
  const onFinish = async (values) => {
    try {
      setLoading(true);
      let finalObj = trimData(values);
      finalObj.profile = photo ? photo : "bankImages/dummy.jpg";
      finalObj.signature = signature ? signature : "bankImages/dummy.jpg";
      finalObj.document = document ? document : "bankImages/dummy.jpg";
      finalObj.key = finalObj.email;
      finalObj.userType = "customer";
      finalObj.branch = userInfo?.branch;
      finalObj.createdBy = userInfo?.email;
      const httpReq = http();
      console.log(finalObj);
     const {data}= await httpReq.post(`/api/users`, finalObj);
     finalObj.customerLoginId=data?.data._id;
      const obj = {
        email: finalObj.email,
        password: finalObj.password,
      };
      await httpReq.post(`/api/customers`, finalObj);
      await httpReq.post(`/api/send-email`, obj);
      await httpReq.put(`/api/branding/${brandingId}`, { bankAccountNo });
      accountForm.resetFields();
      mutate("/api/branding");
      setPhoto(null);
      setDocument(null);
      setSignature(null);
      setNo(no + 1);
      setAccountModal(false);
      messageApi.success("Account created !");
    } catch (err) {
      if (err?.response?.data?.error?.code === 11000) {
        accountForm.setFields([
          {
            name: "email",
            errors: ["Email already exists!"],
          },
        ]);
      } else {
        messageApi.error("Try again later");
      }
    } finally {
      setLoading(false);
    }
  };

  //handle photo
  const handlePhoto = async (e) => {
    let file = e.target.files[0];
    const folderName = "customerPhoto";
    try {
      const result = await uploadFile(file, folderName);
      setPhoto(result.filePath);
    } catch (err) {
      messageApi.error("Unable to upload");
    }
  };

  //handle signature
  const handleSignature = async (e) => {
    let file = e.target.files[0];
    const folderName = "customerSignature";
    try {
      const result = await uploadFile(file, folderName);
      setSignature(result.filePath);
    } catch (err) {
      messageApi.error("Unable to upload");
    }
  };

  //handle document
  const handleDocument = async (e) => {
    let file = e.target.files[0];
    const folderName = "customerDocument";
    try {
      const result = await uploadFile(file, folderName);
      setDocument(result.filePath);
    } catch (err) {
      messageApi.error("Unable to upload");
    }
  };

  // update isActive
  const updateIsActive = async (id, isActive,customerLoginId) => {
    try {
      const obj = {
        isActive: !isActive,
      };
      const httpReq = http();
       await httpReq.put(`/api/customers/${id}`, obj);
        await httpReq.put(`/api/users/${customerLoginId}`, obj);
      messageApi.success("Record updated successfully !");
      setNo(no + 1);
    } catch (err) {
      messageApi.error("Unable to update isActive !");
    }
  };

  //search codding
  const onSearch = (e) => {
    let val = e.target.value.toLowerCase();
    let filter =
      finalCustomer &&
      finalCustomer.filter((customer) => {
        if (customer?.fullName.toLowerCase().indexOf(val) != -1) {
          return customer;
        } else if (customer?.userType.toLowerCase().indexOf(val) != -1) {
          return customer;
        } else if (customer?.email.toLowerCase().indexOf(val) != -1) {
          return customer;
        } else if (customer?.mobile.toLowerCase().indexOf(val) != -1) {
          return customer;
        } else if (customer?.address.toLowerCase().indexOf(val) != -1) {
          return customer;
        } else if (customer?.branch.toLowerCase().indexOf(val) != -1) {
          return customer;
        } else if (
          customer?.accountNo.toString().toLowerCase().indexOf(val) != -1
        ) {
          return customer;
        }
      });
    setAllCustome(filter);
  };

    //delete employee

  const onDeleteCustomer=async (id,customerLoginId)=>{
    try{
     const httpReq=http();
     await httpReq.delete(`/api/customers/${id}`);
       await httpReq.delete(`/api/users/${customerLoginId}`);
      messageApi.success("Customer deleted successfully !");
      setNo(no+1);
    }
    catch(err){
      messageApi.error("Unable to delete user !")
    }
  }

  
  //update employee
  const onEditCustomer=async (obj)=>{
    setEdit(obj);
    setAccountModal(true);
    accountForm.setFieldsValue(obj);
  }

    //update employee
   const onUpdate=async (values)=>{
     try{
      setLoading(true);
      let finalObj=trimData(values);
      delete finalObj.password;
      delete finalObj.email;
      delete finalObj.accountNo;
     if(photo){
      finalObj.profile=photo;
     }
      if(signature){
      finalObj.signature=signature;
     }
      if(document){
      finalObj.document=document;
     }
     const httpReq=http();
     await httpReq.put(`/api/customers/${edit._id}`,finalObj)
     messageApi.success("Employee updated successfully !");
     setNo(no+1);
     setEdit(null);
     setPhoto(null);
     setSignature(null);
     setDocument(null);
     setAccountModal(false);
     accountForm.resetFields();
     }
     catch(err){
    messageApi.error("Unable to update customer !")
     }
     finally{
      setLoading(false);
     }
    
   }


   const onCloseModal=()=>{
  setAccountModal(false);
  setEdit(null);
  accountForm.resetFields();
   }

  // columns for table
  const columns = [
    {
      title: "Photo",
      key: "photo",
      render: (src, obj) => (
        <Image
          src={`${import.meta.env.VITE_BASEURL}/${obj?.profile}`}
          className="rounded-full"
          width={40}
          height={40}
        />
      ),
    },
    {
      title: "Signature",
      key: "signature",
      render: (src, obj) => (
        <Image
          src={`${import.meta.env.VITE_BASEURL}/${obj?.signature}`}
          className="rounded-full"
          width={40}
          height={40}
        />
      ),
    },
    {
      title: "Document",
      key: "document",
      render: (src, obj) => (
        <Button
          type="text"
          shape="circle"
          className="!bg-blue-100 !text-blue-500"
          icon={<DownloadOutlined />}
        ></Button>
      ),
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
    },
    {
      title: "User type",
      dataIndex: "userType",
      key: "userType",
      render: (text) => {
        if (text == "admin") {
          return <span className="capitalize text-indigo-500">{text}</span>;
        } else if (text == "employee") {
          return <span className="capitalize text-green-500">{text}</span>;
        } else {
          return <span className="capitalize text-red-500">{text}</span>;
        }
      },
    },
    {
      title: "Account No",
      dataIndex: "accountNo",
      key: "accountNo",
    },
    {
      title: "Balance",
      dataIndex: "finalBalance",
      key: "finalBalance",
    },
    {
      title: "Fullname",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "DOB",
      dataIndex: "dob",
      key: "dob",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "craetedBy",
    },

    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (_, obj) => (
        <div className="flex gap-1">
          <Popconfirm
            title="Are you sure ?"
            description="Once you update,you can also re-update !"
            onCancel={() => messageApi.info("No changes occur !")}
            onConfirm={() => updateIsActive(obj._id, obj.isActive,obj.customerLoginId)}
          >
            <Button
              type="text"
              className={`${
                obj.isActive
                  ? "!bg-indigo-100 !text-indigo-500"
                  : "!bg-pink-100 !text-pink-500"
              }`}
              icon={obj.isActive ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            ></Button>
          </Popconfirm>

          <Popconfirm
            title="Are you sure ?"
            description="Once you update,you can also re-update !"
            onCancel={() => messageApi.info("No changes occur !")}
            onConfirm={() => onEditCustomer(obj)}
          >
            <Button
              type="text"
              className="!bg-green-100 !text-green-500"
              icon={<EditOutlined />}
            ></Button>
          </Popconfirm>

          <Popconfirm
            title="Are you sure ?"
            description="Once you deleted,you can not re-store !"
            onCancel={() => messageApi.info("your data is safe !")}
            onConfirm={() => onDeleteCustomer(obj._id,obj.customerLoginId)}
          >
            {" "}
            <Button
              type="text"
              className="!bg-pink-100 !text-pink-500"
              icon={<DeleteOutlined />}
            ></Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      {context}
      <div className="grid">
        <Card
          title="Account list"
          style={{ overflowX: "auto" }}
          extra={
            <div className="flex gap-x-3">
              <Input
                placeholder="Search by all"
                prefix={<SearchOutlined />}
                onChange={onSearch}
              />
              <Button
                onClick={() => setAccountModal(true)}
                type="text"
                className="font-bold !bg-blue-500 !text-white"
              >
                Add new account
              </Button>
            </div>
          }
        >
          <Table
            columns={columns}
            dataSource={allCustomer}
            scroll={{ x: "max-content" }}
          ></Table>
        </Card>
      </div>
      <Modal
        open={accountModal}
        onCancel={onCloseModal}
        width={820}
        footer={null}
        title={edit ?  " Update details": "Open New Account"}
      >
        <Form layout="vertical" onFinish={edit ? onUpdate : onFinish} form={accountForm}>
       
         {
!edit &&
   <div className="grid md:grid-cols-3 gap-x-3">
  <Item
              label="Account No"
              name="accountNo"
              rules={[{ required: true }]}
            >
              <Input disabled placeholder="Account no" />
            </Item>
              <Item label="Email" name="email"
            rules={[{ required: edit ? false :true }]}>
              <Input disabled={edit? true :false} placeholder="Enter your email" />
            </Item>

            <Item label="Password" name="password"
            rules={[{ required: edit ? false :true }]}>
              <Input disabled={edit? true :false} placeholder="Enter password" />
            </Item>
   </div>
         }
       
       
          <div className="grid md:grid-cols-3 gap-x-3">
          
            <Item label="Fullname" name="fullName" rules={[{ required: true }]}>
              <Input placeholder="Enter full name" />
            </Item>

            <Item label="Mobile" name="mobile" rules={[{ required: true }]}>
              <Input placeholder="Enter mobile no" />
            </Item>

            <Item
              label="Father Name"
              name="fatherName"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter father name" />
            </Item>

           

            <Item label="DOB" name="dob" rules={[{ required: true }]}>
              <input type="date" />
            </Item>

            <Item label="Gender" name="gender" rules={[{ required: true }]}>
              <Select
                placeholder="Select Gender"
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                ]}
              />
            </Item>

            <Item label="Currency" name="currency" rules={[{ required: true }]}>
              <Select
                placeholder="Select Currency"
                options={[
                  { label: "INR", value: "inr" },
                  { label: "USD", value: "usd" },
                ]}
              />
            </Item>

            <Item
              label="Photo"
              name="xyz"
              //rules={[{required:true}]}
            >
              <Input type="file" onChange={handlePhoto} />
            </Item>

            <Item
              label="Signature"
              name="fghdfg"
              // rules={[{required:true}]}
            >
              <Input type="file" onChange={handleSignature} />
            </Item>

            <Item
              label="Document"
              name="dgdfsgg"
              //rules={[{required:true}]}
            >
              <Input type="file" onChange={handleDocument} />
            </Item>
          </div>

          <Item label="Address" name="address" rules={[{ required: true }]}>
            <Input.TextArea />
          </Item>

            <Item className="flex justify-end items-center">
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
      </Modal>
    </div>
  );
};
export default NewAccount;
