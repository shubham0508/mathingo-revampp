import { ProductSection } from "@/components/shared/product-section";
import { productSectionsData } from "@/config/constant";

export function ProductsShowcase() {
  return (
    <div id="products">
      {productSectionsData.map((product, index) => (
        <ProductSection
          key={index}
          title={product.title}
          description={product.description}
          learnMoreLink={product.learnMoreLink}
          buttonText={product.buttonText}
          image={product.image}
          isReversed={index % 2 !== 0}
          index={index}
        />
      ))}
    </div>
  );
}