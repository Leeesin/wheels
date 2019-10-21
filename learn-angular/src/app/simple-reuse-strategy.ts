// tslint:disable
import { RouteReuseStrategy, DefaultUrlSerializer, ActivatedRouteSnapshot, DetachedRouteHandle, ActivatedRoute } from '@angular/router';

const cacheComponents = [
    'DemoComponent'
]

export class SimpleReuseStrategy implements RouteReuseStrategy {

    _cacheRouters: { [key: string]: any } = {};

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        if (route.data.keepAlive) {
            const instance = route.component
        }
        return route.data.keepAlive
        return false
    }
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {

        // 按path作为key存储路由快照&组件当前实例对象
        // path等同RouterModule.forRoot中的配置
        this._cacheRouters[route.routeConfig.path] = {
            snapshot: route,
            handle: handle
        };
        console.log(' this._cacheRouters 的值是：', this._cacheRouters);
    }
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        // 在缓存中有的都认为允许还原路由
        return !!route.routeConfig && !!this._cacheRouters[route.routeConfig.path];
    }
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        console.log('route2222222222222 的值是：',route);
        // 从缓存中获取快照，若无则返回null
        if (!route.routeConfig || !this._cacheRouters[route.routeConfig.path]) return null;
        return this._cacheRouters[route.routeConfig.path].handle;
    }
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        if (curr.data.keepAlive) {
            // curr.component.ngOnActive()
        }
        // 同一路由时复用路由
        return future.routeConfig === curr.routeConfig;
    }
}
