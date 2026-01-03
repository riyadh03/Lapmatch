import requests
from bs4 import BeautifulSoup

# URL du produit Flipkart
url = "https://www.flipkart.com/asus-rog-strix-scar-17-core-i9-12th-gen-32-gb-1-tb-ssd-windows-11-home-8-gb-graphics-nvidia-geforce-rtx-3070-ti-g733zw-ll139ws-gaming-laptop/p/itm0e721469cc7cc"

# Simuler un navigateur (important car Flipkart bloque parfois les requêtes simples)
headers = {"User-Agent": "Mozilla/5.0"}

# Récupérer le contenu HTML
response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, "html.parser")

images = [] 
for img in soup.find_all("img"): 
    src = img.get("src")    
    alt = img.get("alt", "") 
    if src and "rukminim2.flixcart.com" in src: 
        if "416/416" in src or "832/832" in src or len(alt) > 30:
            images.append(src)

for i, src in enumerate(images, 1):
    print(f"{i}. {src}")