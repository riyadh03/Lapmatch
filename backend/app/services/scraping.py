import requests
from app.core.neo4j import neo4j_db

def scrape_flipkart_image(url: str) -> str | None:
    """
    Récupère l'URL de l'image principale d'un produit Flipkart.
    """
    try:
        from bs4 import BeautifulSoup
    except ModuleNotFoundError as e:
        raise RuntimeError(
            "Dépendance manquante: beautifulsoup4. Installez-la avec: pip install beautifulsoup4"
        ) from e

    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
    except Exception as e:
        print(f"Erreur lors du scraping {url}: {e}")
        return None

    soup = BeautifulSoup(response.text, "html.parser")
    for img in soup.find_all("img"):
        src = img.get("src")
        alt = img.get("alt", "")
        if src and "rukminim2.flixcart.com" in src:
            # Filtrage simple pour les images principales
            if "416/416" in src or "832/832" in src or len(alt) > 30:
                return src
    return None

def update_laptop_image(laptop_id: int, image_url: str) -> bool:
    """
    Met à jour le nœud Laptop correspondant dans Neo4j.
    """
    query = """
    MATCH (l:Laptop {laptop_id: $laptop_id})
    SET l.image_url = $image_url
    RETURN l
    """
    params = {"laptop_id": laptop_id, "image_url": image_url}
    try:
        result = neo4j_db.execute_query(query, params)
        return bool(result)
    except Exception as e:
        print(f"Erreur mise à jour Neo4j pour laptop {laptop_id}: {e}")
        return False

def scrape_and_update_laptops(laptops: list[dict]):
    """
    Parcourt une liste de laptops avec 'laptop_id' et 'external_link',
    scrape l'image et met à jour Neo4j.
    """
    for laptop in laptops:
        laptop_id = laptop.get("laptop_id")
        url = laptop.get("external_link")
        if not url:
            continue

        image_url = scrape_flipkart_image(url)
        if image_url:
            success = update_laptop_image(laptop_id, image_url)
            if success:
                print(f"Image mise à jour pour laptop {laptop_id}")
            else:
                print(f"Échec mise à jour pour laptop {laptop_id}")
