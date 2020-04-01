export class SideNavigationMain {
    constructor(public id: string,
        public title: string,
        public url: string,
        public icon: string,
        public status: string,
        public type: string,
        public innerOptions: Array<SideNavigationInner>,
        public urlTitleList: Array<SideNavigationUrlTitle>,
        public activeicon:any) {
    }
}

export class SideNavigationInner {
    constructor(public id: string,
        public title: string,
        public url: string,
        public icon: string,
        public status: string,
        public urlTitleList: Array<SideNavigationUrlTitle>,
        public activeicon:any) {
    }
}

export class SideNavigationUrlTitle {
    constructor(public url: string,
        public title: string) {
    }
}