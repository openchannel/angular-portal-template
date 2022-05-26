import { Directive, Input } from '@angular/core';
import { Permission } from '@openchannel/angular-common-services';

@Directive({
    selector: '[appPermissions]',
})
export class MockPermissionDirective {
    @Input('appPermissions') permission: Permission[];
}
