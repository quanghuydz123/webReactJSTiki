import React, { useEffect, useMemo, useState } from 'react'

import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { WrapperItemOrder, WrapperListOrder, WrapperHeaderItem, WrapperFooterItem, WrapperContainer, WrapperStatus } from './style';
import Loading from '../../components/LoadingComponent/Loading';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { convertPrice } from '../../utils';
import { useMutationHooks } from "../../hooks/useMutationHook";
import { message } from 'antd';

const MyOrderPage = () => {
  const user = useSelector((state) => state.user)
  const location = useLocation()
  const navigate = useNavigate()
  const { id, token } = location.state
  const fetchMyOrder = async (context) => {
    const res = OrderService.getOrderByUserId(id, token)
    return res
  }
  const queryOrder = useQuery({
    queryKey: ['myOrder'],
    queryFn: fetchMyOrder,
    enabled: user?.id && user?.access_token ? true : false // chỉ gọi khi bằng true
  });
  const { isLoading, data } = queryOrder
  console.log("data",data)
  const handleDetailsOrder = (id)=>{
    navigate(`/details-order/${id}`)
  }
  const handleNavigateProductOrder = (id) => {
    //window.open('/system/admin', '_blank');
    window.open(`/product-detail/${id}`, '_blank');
  }
  const mutation  = useMutationHooks(
    (data) =>{
      const {id,token,orderItems} = data
      const res = OrderService.cancelOrder(id,token,orderItems)
      return res
    }
  )

  const handleCanceOrder = (order)=>{
    mutation.mutate({
      id:order?._id,token:user?.access_token,orderItems:order?.orderItems
    },{
      onSuccess:()=>{
        queryOrder.refetch()
      }
    })
  }
  const { isLoading: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancle, data: dataCancel } = mutation

  useEffect(() => {
    if (dataCancel?.status === 'OK') {
      message.success('Hủy thành công')
    } else if(dataCancel?.status === 'ERR') {
      message.error(dataCancel?.message)
    }else if (isErrorCancle) {
      message.error()
    }else if(isSuccessCancel){
      message.success('thành công')
    }
  }, [isErrorCancle, isSuccessCancel,dataCancel])
  const renderProduct = (data) => {
    return data?.map((order) => {
      return (
        <>
          <WrapperHeaderItem key={order?._id}>
           <div style={{display:'flex',cursor:'pointer'}}  onClick={() => handleNavigateProductOrder(order?.product)}>
            <img src={order?.image}
                style={{
                  width: '70px',
                  height: '70px',
                  objectFit: 'cover',
                  border: '1px solid rgb(238, 238, 238)',
                  padding: '2px'
                }}
              />
              <div style={{
                width: 260,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                height:'100%',
                marginLeft: '10px'
              }}>{order?.name}</div>
           </div>
            <span style={{ fontSize: '13px', color: '#242424', marginLeft: 'auto' }}>{convertPrice(order?.price)}</span>
          </WrapperHeaderItem>
      
        </>
      )
    })
  }
  return (
    <Loading isLoading={isLoading}>
      <WrapperContainer>
        <div style={{ height: '100%', width: '1270px', margin: '0 auto',marginBottom:'20px' }}>
          <h4>Đơn hàng của tôi</h4>
          <WrapperListOrder>
            {data && data.data?.map((order) => {
              return (
                <WrapperItemOrder key={order?._id}>
                  <WrapperStatus>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Trạng thái</span>
                    <div>
                      <span style={{ color: 'rgb(255, 66, 78)' }}>Giao hàng: </span>
                      <span style={{ color: 'rgb(90, 32, 193)', fontWeight: 'bold' }}>{order?.isDelivered ? 'Đã giao hàng' :'Đang giao hàng'}</span>
                    </div>
                    <div>
                      <span style={{ color: 'rgb(255, 66, 78)' }}>Thanh toán: </span>
                      <span style={{ color: 'rgb(90, 32, 193)', fontWeight: 'bold' }}>{order?.isPaid ? 'Đã thanh toán' :'Chưa thanh toán'}</span>
                    </div>
                  </WrapperStatus>
                  {renderProduct(order?.orderItems)}
                  <WrapperFooterItem>
                    <div>
                      <span style={{ color: 'rgb(255, 66, 78)' }}>Tổng tiền: </span>
                      <span
                        style={{ fontSize: '13px', color: 'rgb(56, 56, 61)', fontWeight: 700 }}
                      >{convertPrice(order?.totalPrice)}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <ButtonComponent
                        onClick={()=>handleCanceOrder(order)}
                        size={40}
                        styleButton={{
                          height: '36px',
                          border: '1px solid #9255FD',
                          borderRadius: '4px',
                        }}
                        textButton={'Hủy đơn hàng'}
                        styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
                      >
                      </ButtonComponent>
                      <ButtonComponent
                        onClick={()=>handleDetailsOrder(order?._id)}
                        size={40}
                        styleButton={{
                          height: '36px',
                          border: '1px solid #9255FD',
                          borderRadius: '4px'
                        }}
                        textButton={'Xem chi tiết'}
                        styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
                      >
                      </ButtonComponent>
                    </div>
                  </WrapperFooterItem>
                </WrapperItemOrder>
              )
            })}
          </WrapperListOrder>
        </div>
      </WrapperContainer>
    </Loading>
  )
}

export default MyOrderPage