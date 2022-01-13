import Vue from 'vue'
import { RadioGroup, Radio, Dialog, Pagination, Tooltip, Switch, Table, TableColumn, Row, Col, Card, BreadcrumbItem, Breadcrumb, Button, Form, FormItem, InputNumber, Input, Message, MessageBox, Container, Aside, Header, Main, Footer, Menu, Submenu, MenuItem, MenuItemGroup } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(InputNumber)
Vue.use(Input)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
