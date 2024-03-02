import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Image, Popover } from 'antd';
import {WapperHeader,WapperTextHeader,WapperHeaderAccuont, WapperContentPopup} from './style'
import Search from "antd/es/input/Search";
import {
    UserOutlined,
    CaretDownOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import TypeProduct from "../Product/TypeProduct/TypeProduct";
import logocongnghe from '../../assets/images/logocongnghe.jpg'
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as UserService from '../../services/UserService'
import { useDispatch} from 'react-redux'
import { resetUser } from "../../redux/slides/userSlide";
import Loading from "../LoadingComponent/Loading";

const Header = ({isHiddenSearch = false,isHiddenCart = false,isAdmin=false})=>{
    const arr = ['TV','Tu lanh','Lap top']
    //lấy dữ liệu truyền vào redux
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    const [userName,setUserName] = useState('')
    const [userAvatar,setUserAvatar] = useState('')

    const handleNavigateLogin = ()=>{
        navigate('/sign-in') // chuyển đến
    }
    const handleNavigateHome = (event)=>{
            // Check if Ctrl (or Command on Mac) key is pressed
            if (event.ctrlKey || event.metaKey) {
                // Open link in a new tab
                window.open('/', '_blank');
            } else {
                // Handle navigation normally
                navigate('/')
            }
    }
    const handleNavigateAdminHome = (event)=>{
        // Check if Ctrl (or Command on Mac) key is pressed
        if (event.ctrlKey || event.metaKey) {
            // Open link in a new tab
            window.open('/system/admin', '_blank');
        } else {
            // Handle navigation normally
            navigate('/system/admin')
        }
}
    const handleNavigateProfile = (event)=>{
        if (event.ctrlKey || event.metaKey) {
            // Open link in a new tab
            window.open('/profile-user', '_blank');
        } else {
        navigate('/profile-user')
        }
    }
    const handleLogout = async () => {
        setLoading(true)
        await UserService.loguotUser()
        dispatch(resetUser())
        localStorage.removeItem('access_token')
        setLoading(false)
    }
    const handleNavigateManager=(event)=>{
        if (event.ctrlKey || event.metaKey) {
            // Open link in a new tab
            window.open('/system/admin', '_blank');
        } else {
        navigate('/system/admin')
        }
    }
    useEffect(()=>{
        setLoading(true)
        setUserName(user?.name)
        setUserAvatar(user?.avatar)
        setLoading(false)
    },[user.name,user?.avatar])
    const content = (
        <div>
          <WapperContentPopup onClick={handleNavigateProfile}>Thông tin người dùng</WapperContentPopup>
          {user?.isAdmin && <WapperContentPopup onClick={handleNavigateManager}>Quản lý hệ thống</WapperContentPopup>}
          <WapperContentPopup onClick={handleLogout}>Đăng xuất</WapperContentPopup>
        </div>
      );

    //const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);
    return (
        <div>
             <WapperHeader style={{display:"flex",alignItems:'center'}}>
            {isAdmin ? <Col span={18}><WapperTextHeader onClick={handleNavigateAdminHome}>Trang quản trị</WapperTextHeader></Col> :
            <Col span={5}><WapperTextHeader onClick={handleNavigateHome}>Shop của tôi</WapperTextHeader></Col>}
             
                {!isHiddenSearch &&
                    (                    <Col span={13}>
                        <ButtonInputSearch
                            size='large'
                            textButton = 'Tìm kiếm'
                            placeholder='Input text'
                        />      
                        
                        </Col>)
                }
                
                <Col span={6} style={{
                    display:'flex',
                    gap:'54px',
                    alignItems:'center'
                }}>
                    <Loading isLoading={loading}>
                        <WapperHeaderAccuont>
                            {userAvatar ? (
                                <img src={userAvatar} style={{
                                    height:'40px',
                                    width:'40px',
                                    borderRadius:'50%',
                                    objectFit:'cover'
                                }} alt="avatar"/>
                            ): <UserOutlined style={{fontSize:'35px'}} />}
                            
                            {userName ? (
                                <>
                                    
                                    <Popover content={content} trigger="hover">
                                        <div style={{cursor:'pointer'}} >{userName}</div>
                                    </Popover>
                                </>
                            ):
                            <div onClick={handleNavigateLogin} style={{cursor:'pointer'}}>
                            <span>Đăng nhập/Đăng ký</span>
                            <div>
                                <span>Tài khoản</span>
                                <CaretDownOutlined />
                            </div>
                        </div>
                        }
                        
                        </WapperHeaderAccuont>
                    </Loading>
                    {!isHiddenCart && (
                        <div>
                        {/* Badge icon shop */}
                        <Badge count={1} size="small"> 
                            <ShoppingCartOutlined style={{fontSize:'35px', color:'#fff'}} />    
                        </Badge>
                        
                        <span style={{fontSize:'12px',color:'#fff'}}>Giỏ hàng</span>
                    </div>
                    )}
                </Col>
            </WapperHeader>
            {!isAdmin && (
                <div style={{}}  className="container">
                <div className="WapperTypeProduct">
                    {arr.map((item) => {
                        return <TypeProduct name={item} key={item} mr={16} p={10} />
                    })}
                </div>
            </div>
            )}
            
        </div>
        
    )
}

export default Header