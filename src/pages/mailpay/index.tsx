import React from 'react';

import TopNavBar from '@/components/TopNavBar';

import { connect } from 'dva';

import { getAccount } from '@/utils/authority';

import { isWeiXin } from '@/utils/utils';

import moment from 'moment';

import {
  IconButton,
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
} from '@material-ui/core';

import {
  WhiteSpace,
} from 'antd-mobile';

import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import SearchIcon from '@material-ui/icons/Search';

import { makeStyles } from '@material-ui/core/styles';

// const styles = require('./index.less');

import { List, AutoSizer } from 'react-virtualized';


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

const PaymentListPanel = props => {

  const classes = useStyles();

  const bull = <span className={classes.bullet}>•</span>;

  const { data } = props;

  const rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) =>  {
    return (
      <Card key={key} className={classes.root}  >
        <CardContent>
          <Typography variant="h5" component="h2">
            {data[index].address}
          </Typography>
          <Typography variant="body2" component="p">
            口罩类型{bull} {data[index].maskName}({data[index].maskId})
          </Typography>
          <Typography variant="body2" component="p">
            付款时间{bull} {data[index].payTime}
          </Typography>
          <Typography variant="body2" component="p">
            中签日期{bull} {data[index].appointDate}
          </Typography>
        </CardContent>
      </Card>
    );
   };

  return (
    <AutoSizer>
    {({height, width}) => (
      <List
        width={width}
        height={height}
        rowCount={data.length}
        rowHeight={132}
        rowRenderer={rowRenderer}
      />
    )}
    </AutoSizer>
  );
}

interface IPaymentData {
  pk: number;
  address: string;
  maskId: number;
  maskname: string;
  payTime: string;
  appointDate: string;
}

interface IMailPayState {
  startDate: string;
  endDate: string;
}

interface IMailPayProps {
  dispatch?: any;
  loading?: boolean;
  mailpay?: {
    paymentData : IPaymentData[],
    message : string;
  };
}

@connect(({ mailpay, loading }) => ({
  mailpay,
  loading: loading.models.mailpay,
}))
class Index extends React.Component<IMailPayProps,IMailPayState> {


  constructor(props: any) {
    super(props);

    this.state = {
      startDate : `${moment().format('YYYY-MM-DD')}T00:00`,
      endDate : moment().format('YYYY-MM-DD[T]H:mm'),
    };
  }

  componentWillUpdate() {
    
  }
  
	componentWillUnmount(){
    // const { mailpay } = this.props;
    this.setState({
      startDate : '',
      endDate : '',
    });
	}


  onStartDateChange = (value) => {
    this.setState({
      startDate : value
    });
  }

  onEndDateChange = (value) => {
    this.setState({
      endDate : value
    });
  }

  onQuerySubmit = () => {
    const { startDate, endDate } = this.state;
    const { dispatch } = this.props;
    // if( startDate !== '' && endDate !== '') {
    //   dispatch({
    //     type: 'mailpay/queryPayments',
    //     payload: {
    //       startDate,
    //       endDate,
    //     },
    //   });
    // }
  }


  onDownload = () => {
    const { startDate, endDate } = this.state;
    if( startDate !== '' && endDate !== '') {
      window.open(`rest/mailpay/downloadPayments?startDate=${startDate.replace('T',' ')}&endDate=${endDate.replace('T',' ')}`,'about:blank');
    }
  }


  public render() {
    const { startDate, endDate }  = this.state;
    const { mailpay } = this.props;
    const { paymentData } = mailpay;
    
    const weixin = isWeiXin();


    return (
        <div>
          <TopNavBar title={`付款信息`} rightContent={ !weixin && <IconButton onClick={this.onDownload} > <CloudDownloadIcon /> </IconButton>} />
          <WhiteSpace size="xl" />
          <Grid container spacing={2}>
            <Grid item xs>
              <TextField
                label="开始时间"
                type="datetime-local"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                defaultValue={startDate}
                onChange={ (e) => this.onStartDateChange(e.target.value)}
              />
            </Grid>
            <Grid item xs>
              <TextField
                label="结束时间"
                type="datetime-local"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                defaultValue={endDate}
                onChange={ (e) => this.onEndDateChange(e.target.value)}
              />
            </Grid>
            {/* <Grid item xs={2}>
            <IconButton color="primary" aria-label="查找" onClick={this.onQuerySubmit}>
              <SearchIcon />
            </IconButton>
            </Grid> */}
          </Grid>
          <Paper style={{ height: 450, width: '100%' }}>
            <PaymentListPanel data={paymentData} />
          </Paper>

        </div>
    );
  }
}

export default Index;
