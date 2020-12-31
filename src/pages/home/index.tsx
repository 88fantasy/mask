import React from 'react';

import {
  Grid,
  Modal
} from 'antd-mobile';

import router from 'umi/router';

import {
  AppBar,
  Toolbar,
  Typography,
  Button
} from '@material-ui/core';

import { withStyles, createStyles, Theme, styled } from '@material-ui/core/styles';

import { getAccount } from '@/utils/authority';

// const styles = require('./index.less');

const shopfuncs = [{
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 24 24" fill="#569ac4"><path d="M24 22h-24v-15h24v15zm-15-20c-1.104 0-2 .896-2 2v2h2v-1.5c0-.276.224-.5.5-.5h5c.276 0 .5.224.5.5v1.5h2v-2c0-1.104-.896-2-2-2h-6z"/></svg>,
    text: '核销',
    detail: '扫描条码核销预约号',
    path: '/sale',
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 24 24" fill="#fdc645"><path d="M7 24h-6v-6h6v6zm8-9h-6v9h6v-9zm8-4h-6v13h6v-13zm0-11l-6 1.221 1.716 1.708-6.85 6.733-3.001-3.002-7.841 7.797 1.41 1.418 6.427-6.39 2.991 2.993 8.28-8.137 1.667 1.66 1.201-6.001z"/></svg>,
    text: '预约清单',
    detail: '当日所有预约号列表',
    path: '/orderlist',
  }
];

const onlinefuncs = [{
  icon: <svg xmlns="http://www.w3.org/2000/svg" height="75" viewBox="0 0 24 24" width="75" fill="#fdc645"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>,
  text: '付款信息',
  detail: '查看油剂微信付款信息',
  path: '/mailpay',
}
];

const useStyles = (theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: '#fff'
  },
});

const CustomAppBar = styled(AppBar)({
  background: '#2196f3',
});



@withStyles(useStyles)
export default class extends React.Component<{}> {
  constructor(props) {
    super(props);

    this.state = {
      showVersion : false
    }
  }

  onFuncClick = (el :any ,index : number) => {
    // let data = JSON.stringify(this.props.data)
    let path = `${el.path}`
    router.push(path)
  }

  onVersionModalShow = (e) => {
    e.preventDefault(); 
    this.setState({
      showVersion: true,
    });
  }
  onVersionModalClose = () => {
    this.setState({
      showVersion: false,
    });
  }

  componentDidMount () {

  }

  public render = () => {
    const { showVersion } = this.state;
    const { classes } = this.props;
    const account = getAccount();

    const renderfuncs = account.user === 'GZ0001' ? onlinefuncs : shopfuncs; 

    return (
      <div>
        <div className={classes.root}>
          <CustomAppBar position="static">
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                {account.accountName}
              </Typography>
              {/* <Button color="inherit" onClick={this.onVersionModalShow} >version-0.1</Button> */}
            </Toolbar>
          </CustomAppBar>
        </div>

        <Grid data={renderfuncs}
            columnNum={2}
            renderItem={dataItem => (
              <div style={{ padding: '12.5px' }}>
                {dataItem.icon}
                <div style={{ color: '#888', fontSize: '16px', marginTop: '12px' }}>
                  <span>{dataItem.text}</span>
                </div>
                <div style={{ color: '#888', fontSize: '12px', marginTop: '12px' }}>
                  <span>{dataItem.detail}</span>
                </div>
              </div>
            )}
            onClick={this.onFuncClick}
        />

        <Modal
          visible={showVersion}
          transparent
          maskClosable={false}
          onClose={this.onVersionModalClose}
          title="版本信息"
          footer={[{ text: 'Ok', onPress: () => { this.onVersionModalClose(); } }]}
        >
          <div style={{ textAlign:'left' }}>
            <p>测试版本</p>
          </div>
        </Modal>
      </div>
    );
  };
}
