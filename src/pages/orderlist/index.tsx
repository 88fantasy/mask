import React from 'react';

import TopNavBar from '@/components/TopNavBar';

import { connect } from 'dva';

import { getAccount } from '@/utils/authority';

import { isWeiXin } from '@/utils/utils';

import moment from 'moment';

import {
  Card,
  CardContent,
  Typography,
  CardActions,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  IconButton,
} from '@material-ui/core';

import { Alert, AlertTitle } from '@material-ui/lab';

import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
  SearchBar
} from 'antd-mobile';

import { makeStyles } from '@material-ui/core/styles';

import { exportCsv } from '@/utils/utils';

// const styles = require('./index.less');


interface IAppointmentData {
  serialNumber: number;
  chemisId : string;
  appointCode: string;
  idCard: string;
  mobile: string;
  fullname: string;
  maskName: string;
  maskId: number;
  appointNum: number;
  saled: boolean;
  saleString: string;
  saleDate: string;
  quantumString:string;
  appointDate:string;
}

interface ISaleState {
  searchValue: string;
}

interface ISaleProps {
  dispatch?: any;
  loading?: boolean;
  sale?: {
    orderData : IAppointmentData[],
    message : string;
  };
}

const useStyles = makeStyles(theme => ({
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
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

const OrderExpansionPanels = props => {

  const classes = useStyles();

  const [expanded, setExpanded] = React.useState(false);

  const bull = <span className={classes.bullet}>•</span>;

  const { data } = props;

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>
      {
        data.map(row => {
          return (
            <ExpansionPanel expanded={expanded === `panel${row.serialNumber}`} onChange={handleChange(`panel${row.serialNumber}`)}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${row.serialNumber}-content`}
                id={`panel${row.serialNumber}-header`}
              >
                <Typography className={classes.heading}>{row.appointCode}</Typography>
                <Typography className={classes.secondaryHeading}>{row.fullname}{bull}{row.appointNum}*{row.maskName}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Card id={`panel${row.serialNumber}-card`} className={classes.root}>
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
                    <Typography variant="body2" component="p">
                      口罩类型{bull} {row.maskName}({row.maskId})
                    </Typography>
                    <Typography variant="body2" component="p">
                      数量{bull} {row.appointNum}
                    </Typography>
                    <Typography variant="body2" component="p">
                      时间段{bull} {row.appointDate} - {row.quantumString}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {
                      row.saled &&
                      <Typography variant="body2" component="p" color="secondary">
                        {row.saleString}}
                      </Typography>
                    }
                  </CardActions>
                </Card>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )
        })
      }
    </div>
  );
}

const headers = [{
  title : '门店ID',
  column : 'chemisId'
},{
  title : '预约号',
  column : 'appointCode',
  formatter : (cell) => {
    return '`'+cell;
  },
},{
  title : '身份证',
  column : 'idCard'
},{
  title : '电话',
  column : 'mobile',
  formatter : (cell) => {
    return '`'+cell;
  },
},{
  title : '姓名',
  column : 'fullname'
},{
  title : '口罩ID',
  column : 'maskId'
},{
  title : '预约数量',
  column : 'appointNum'
},{
  title : '时间段',
  column : 'quantumString'
},{
  title : '核销状态',
  column : 'saleString'
},{
  title : '核销时间',
  column : 'saleDate'
},{
  title : '购买日期',
  column : 'appointDate'
}];

const today = moment().format('YYYY-MM-DD');

@connect(({ sale, loading }) => ({
  sale,
  loading: loading.models.sale,
}))
class Index extends React.Component<ISaleProps,ISaleState> {


  constructor(props: any) {
    super(props);

    this.state = {
      searchValue : '',
    };

  }
  componentWillMount() {
    this.refreshData();
  }

  componentWillUpdate() {
    // this.refreshData();
  }

  componentWillUnmount(){
    const { sale } = this.props;
    sale.orderData = [];
	}

  onSearchValueChange = (value) => {
    this.setState({ searchValue : value });
  }

  onSearchValueClear = () => {
      this.setState({ searchValue : '' });
  }

  refreshData = () => {
    const account = getAccount();
    const { dispatch } = this.props;
    dispatch({
      type: 'sale/queryChemistOrders',
      payload: {
        user : account.user,
      },
    });
  }

  onDownload = () => {
    const { sale } = this.props;
    const { orderData }  = sale;

    if( orderData && orderData.length > 0 ) {
      const downloadData = [...orderData];
      exportCsv(headers,downloadData,`${today}.csv`);
    }
    else {

    }
  }

  render() {
    const { searchValue }  = this.state;
    const { sale } = this.props;

    const { orderData, message } = sale;

    const weixin = isWeiXin();

    

    const renderData = searchValue === '' ? [...orderData] : orderData.filter( row => {
      return row.appointCode.includes(searchValue) 
              || row.mobile.includes(searchValue)
              || row.fullname.includes(searchValue)
              || row.idCard.includes(searchValue)
            ;
    });

    return (
        <div>
          <TopNavBar title={`预约码清单`} rightContent={ !weixin && <IconButton onClick={this.onDownload} > <CloudDownloadIcon /> </IconButton>} />
          <SearchBar
            value={searchValue}
            placeholder="预约码,姓名,手机号,身份证"
            onChange={this.onSearchValueChange}
            onClear={this.onSearchValueClear}
          />
          {
            message && message !== '' && 
            <Alert severity="error">
              <AlertTitle>错误</AlertTitle>
              {message}
            </Alert>
          }
          <OrderExpansionPanels data={renderData}/>
        </div>
    );
  }
}

export default Index;
