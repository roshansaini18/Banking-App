import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Form, Image, Input, message, Select } from "antd";
import { useState } from "react";
import {http,trimData} from "../../../modules/modules";

const NewTransaction = () => {
  // get user info from session storage
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

  // form info
  const [transactionForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // state collection
  const [accountNo, setAccountNo] = useState("");
  const [accountDetails, setAccountDetails] = useState(null);

  const onFinish = async (values) => {
    try{
      const finalObj=trimData(values);
      let balance=0;
      if(finalObj.transactionType==="cr"){
        balance=Number(accountDetails.finalBalance)+Number(finalObj.transactionAmount);
      }
   else if (finalObj.transactionType === "dr") {
          if (Number(finalObj.transactionAmount) > Number(accountDetails.finalBalance)) {
          return messageApi.warning("Insufficient balance");
  }
  balance = Number(accountDetails.finalBalance) - Number(finalObj.transactionAmount);
}
      
      finalObj.currentBalance=accountDetails.finalBalance;
      finalObj.customerId=accountDetails._id;
      finalObj.accountNo=accountDetails.accountNo;
      finalObj.branch=userInfo.branch;
      const httpReq=http();
      await httpReq.post("/api/transaction",finalObj);
          await httpReq.put(`/api/customers/${accountDetails._id}`,{finalBalance:balance});

          messageApi.success("Transaction created successfully !");
          transactionForm.resetFields();
          setAccountDetails(null);
    }
    catch(error){
      messageApi.error("Unable to process transaction !");
    }

  };

  const searchByAccountNo = async () => {
    if (!accountNo) {
      return messageApi.warning("Please enter an account number");
    }
    try {
      const obj = {
        accountNo,
        branch: userInfo?.branch
      }

      const httpReq = http();
      const { data } = await httpReq.post('/api/find-by-account', obj);
      
      if (data?.data) {
        setAccountDetails(data?.data);
      } else {
        messageApi.warning("There is no record of this account");
        setAccountDetails(null);
      }
    } catch (error) {
      messageApi.error("There is no record of this account");
    }
  };

  return (
    <div>
      {contextHolder}
      <Card
        title="New Transaction"
        extra={
          <Input
            placeholder="Enter account number"
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value)}
            addonAfter={
              <SearchOutlined
                style={{ cursor: "pointer" }}
                onClick={searchByAccountNo}
              />
            }
          />
        }
      >
        {accountDetails ? (
          <div>
            <div className="flex items-center justify-start gap-4 mb-4">
              <Image
                src={`${import.meta.env.VITE_BASEURL}/${accountDetails?.profile}`}
                width={100}
                className="rounded-full"
              />
              <Image
                src={`${import.meta.env.VITE_BASEURL}/${accountDetails?.signature}`}
                width={100}
                className="rounded-full"
              />
            </div>
            <div className="mt-5 grid md:grid-cols-3 gap-8">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <b>Name:</b>
                  <b>{accountDetails?.fullName || "N/A"}</b>
                </div>
                <div className="flex justify-between items-center">
                  <b>Mobile:</b>
                  <b> {accountDetails?.mobile || "N/A"}</b>
                </div>
                <div className="flex justify-between items-center">
                  <b>Balance:</b>
                  <b>
                    {accountDetails?.currency==="inr"?
                    "₹"
                  :
                  "$"
                  }
                    {accountDetails?.finalBalance}</b>
                </div>
                <div className="flex justify-between items-center">
                  <b>DOB:</b>
                  <b>{accountDetails?.dob || "N/A"}</b>
                </div>
                <div className="flex justify-between items-center">
                  <b>Currency:</b>
                  <b>{accountDetails?.currency || "N/A"}</b>
                </div>
              </div>

              <div></div>

              <Form
                form={transactionForm}
                 onFinish={onFinish}
                layout="vertical"
                className="w-full"
              >
                <div className="grid md:grid-cols-2 gap-x-3">
                  <Form.Item
                    label="Transaction Type"
                    name="transactionType"
                    rules={[{ required: true, message: "Please select type" }]}
                  >
                    <Select
                      placeholder="Transaction Type"
                      options={[
                        { value: "cr", label: "CR" },
                        { value: "dr", label: "DR" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Transaction Amount"
                    name="transactionAmount"
                    rules={[{ required: true, message: "Please enter amount" }]}
                  >
                    <Input placeholder="500000" type="number" min="0" />
                  </Form.Item>
                  <Form.Item
                    label="Refrence"
                    name="refrence"
                    className="md:col-span-2"
                  >
                    <Input.TextArea rows={3} />
                  </Form.Item>
                </div>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    type="primary"
                    className="!w-full !font-semibold"
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        ) : (
          <Empty />
        )}
      </Card>
    </div>
  );
};

export default NewTransaction;
