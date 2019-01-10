import { NgModule } from '@angular/core';
import { CartInfoComponent } from './cart-info/cart-info';
import { ProductReviewComponent } from './product-review/product-review';
@NgModule({
	declarations: [CartInfoComponent,
    ProductReviewComponent,
    ],
	imports: [],
	exports: [CartInfoComponent,
    ProductReviewComponent,
    ]
})
export class ComponentsModule {}
