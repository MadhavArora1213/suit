import re

with open('src/components/SellerShopPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Reduce hero height
content = content.replace('h-[75vh] md:h-[85vh]', 'h-[45vh] md:h-[55vh]')

# 2. Extract sections
info_card_match = re.search(r'(      \{\/\* ═══════ SHOP INFO CARD ═══════ \*\/.*?      </div>\n)', content, re.DOTALL)
products_match = re.search(r'(      \{\/\* ═══════ PRODUCTS ═══════ \*\/.*?      </div>\n)', content, re.DOTALL)

if info_card_match and products_match:
    info_card = info_card_match.group(1)
    products = products_match.group(1)
    
    # Adjust margins for the new order
    info_card_new = info_card.replace('-mt-12', 'mt-16 md:mt-24')
    products_new = products.replace('mt-16 md:mt-20', '-mt-12 relative z-20')
    
    # Replace the whole block
    original_block = info_card + '\n' + products
    new_block = products_new + '\n' + info_card_new
    
    content = content.replace(original_block, new_block)
    
    with open('src/components/SellerShopPage.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success: Swapped sections and updated hero height.")
else:
    print("Failed to find sections.")
