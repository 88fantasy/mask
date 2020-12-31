import React from 'react';

import TopNavBar from '@/components/TopNavBar';

import { connect } from 'dva';

import { getAccount } from '@/utils/authority';

import { isWeiXin } from '@/utils/utils';

import {
  CssBaseline,
  IconButton,
  Container,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  List,
  ListItem
} from '@material-ui/core';

import { Alert, AlertTitle } from '@material-ui/lab';

import {
  WhiteSpace,
  SearchBar
} from 'antd-mobile';

import CameraAltIcon from '@material-ui/icons/CameraAlt';

import { makeStyles } from '@material-ui/core/styles';

const styles = require('./index.less');


interface IAppointmentData {
  serialNumber: number;
  appointCode: string;
  idCard: string;
  mobile: string;
  fullname: string;
  maskName: string;
  maskId: number;
  appointNum: number;
  saled: boolean;
  saleDate:string;
  quantumString:string;
}

interface ISaleState {
  searchValue: string;
  message: string;
  reducerFlag : boolean;
}

interface ISaleProps {
  dispatch?: any;
  loading?: boolean;
  sale?: {
    appointmentData : IAppointmentData[],
    message : string;
  };
}

const EnumQueryType = Object.freeze({
  none : 0 ,  //不识别
  appointCode : 1,  //预约码
  mobile : 2,  //手机号
  fullname : 3,  //姓名
});

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const AppointCard = (props) => {
  const classes = useStyles();
  const { appointment, confirmAction } = props;
  const bull = <span className={classes.bullet}>•</span>;

  const [open, setOpen] = React.useState(false);

  const [currentCode, setCurrentCode] = React.useState('');

  const handleClickOpen = (appointCode : string) => {
    setOpen(true);
    setCurrentCode(appointCode);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm= () => {
    setOpen(false);
    confirmAction(currentCode);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container fixed>
        <List component="nav">
        {appointment.map(row => {
          return (
            <ListItem>
              <Card className={classes.root} key={row.serialNumber}>
                <CardContent>
                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                    预约码{bull} {row.appointCode}
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {row.idCard}
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    姓名{bull} {row.fullname}
                  </Typography>
                  <Typography variant="body2" component="p">
                    手机号{bull} {row.mobile}
                  </Typography>
                  <Typography variant="h6" component="p" color="secondary">
                    口罩类型{bull} {row.maskName}({row.maskId})
                  </Typography>
                  <Typography variant="body2" component="p" >
                    数量{bull} {row.appointNum}
                  </Typography>
                  <Typography variant="body2" component="p">
                    时间段{bull} {row.quantumString}
                  </Typography>
                </CardContent>
                <CardActions>
                {
                  row.saled &&
                  <Typography variant="body2" component="p" color="secondary">
                    {row.saleString}
                  </Typography>
                }
                {
                  !row.saled &&
                    <Button size="large" color="secondary" onClick={() => {
                      handleClickOpen(`${row.appointCode}`);
                    } } >确认预约码</Button>
                }
                </CardActions>
              </Card>
            </ListItem>
            
          )
        })}
        </List>
      </Container>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">确认核销预约码</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography variant="h5" component="span" color="secondary">
              {currentCode}
            </Typography>
            <br />
            <Typography variant="body2" component="span">
              核销后 将无法回退 请确认
            </Typography> 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            取消
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

const defaultState = {
  searchValue : '',
  message : '',
  reducerFlag : false,
};

@connect(({ sale, loading }) => ({
  sale,
  loading: loading.models.sale,
}))
class Index extends React.Component<ISaleProps,ISaleState> {


  constructor(props: any) {
    super(props);

    this.state = {
      ...defaultState,
    };

    this.onConfirmAppointment = this.onConfirmAppointment.bind(this);
  }

  componentWillUpdate() {
    
  }
  
	componentWillUnmount(){
    this.setState({
      ...defaultState,
    });
	}


  onSearchValueFocus = (e) => {
    e.target.select();
  }

  onSearchValueSubmit = (value) => {
     this.onQueryAppointment(value);
  }

  onCameraRaise = () => {
    window.wx.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ["barCode"], // 可以指定扫二维码还是一维码，默认二者都有 "qrCode",
      success: this.onScanSuccess
    });
  }

  onScanSuccess = (res) => {
    this.onQueryAppointment(res.resultStr.split(',')[1]);
    // this.setState({
    //   searchValue : res.resultStr
    // });
  }

  onQueryAppointment = ( code : string) => {
    if( code !== '' ) {
      const account = getAccount();
      const { dispatch } = this.props;

      let type = 0;
      switch(code.length) {
        case 18:
          type = EnumQueryType.appointCode; 
          break;
        case 11:
          type = EnumQueryType.mobile;
          break;
        case 2:
        case 3:
        case 4:
          type = EnumQueryType.fullname;
          break;
        default:
          type = EnumQueryType.none;
      }

      if(type !== EnumQueryType.none) {
        dispatch({
          type: 'sale/queryAppointment',
          payload: {
            user: account.user, 
            code,
          },
        });
        this.setState({
          message : '',
          reducerFlag : true,
        });
      }
      else {
        this.setState({
          message : '输入长度不正确[预约码(18),手机号(11),姓名(2|3|4)]',
          reducerFlag : false,
        })
      }
    }
  }

  onConfirmAppointment = (code : string) => {
    if( code !== '' ) {
      const account = getAccount();
      const { dispatch } = this.props;
      dispatch({
        type: 'sale/confirmAppointment',
        payload: {
          user: account.user,
          code,
        },
      });
    }
  }


  public render() {
    const { searchValue, message, reducerFlag }  = this.state;
    const { sale } = this.props;
    
    const weixin = isWeiXin();

    const renderMsg = reducerFlag ? sale.message : message ;

    return (
        <div>
          <TopNavBar title={`核销预约码`} rightContent={weixin && <IconButton onClick={this.onCameraRaise} > <CameraAltIcon /> </IconButton>} />
          <WhiteSpace size="xl" />
          {/* <SearchBar
            value={searchValue}
            placeholder="预约码,姓名,手机号,身份证"
          /> */}
          {
            !weixin &&
            <TextField label="输入预约码" type="text" style={{width:'100%'}} 
              autoFocus
              onFocus={this.onSearchValueFocus} 
              onKeyUp={ (e) => {
                if(e.keyCode === 13) {
                  this.onSearchValueSubmit(e.target.value);
                }
              }} ></TextField>
          }
          <WhiteSpace size="xl" />
          <WhiteSpace size="xl" />
          <WhiteSpace size="xl" />
          {
            renderMsg !== '' && 
            <Alert severity="error">
              <AlertTitle>错误</AlertTitle>
              {renderMsg}
            </Alert>
          }
          { reducerFlag && sale.appointmentData && 
            <AppointCard appointment={sale.appointmentData} confirmAction={this.onConfirmAppointment}/>
          }
        </div>
    );
  }
}

export default Index;
