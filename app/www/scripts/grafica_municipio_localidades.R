#!/usr/bin/env Rscript
library(DBI)
library(dplyr)
library(ggplot2)
library(magrittr)
library(sf)
library(ipa)

con <- DBI::dbConnect(RPostgres::Postgres(), dbname = "siclr_db",
                 host = "172.16.238.10", port = "5432",
                 user = "postgres", password = "postgres")

args <- commandArgs(TRUE)
id_muni <- args[1]

query_mun <- paste("SELECT * from edo_mun.municipios WHERE ", "\"ID_MUN\"", " = ", id_muni, ";")
municipio <- ipa::db_get_table(con, query_mun)

query_edo <- paste("SELECT * from edo_mun.estados WHERE ", "\"ID_ENT\"", " = ", municipio$id_ent, ";")
estado <- ipa::db_get_table(con, query_edo)

query_loc <- "SELECT * FROM loc.localidades"
loc <- ipa::db_get_table(con, query_loc)

localidad <- loc %>% 
  filter(id_mun == municipio$id_mun, pobtot >= 100 & pobtot <= 2500)

# Define un mapa base por defecto
basemaps::set_defaults(
  map_service = "osm", 
  map_type = "streets",
  map_res = 0.5)

# Llama la función png para inicializar el gráfico
save_path <- "../temp-img/"
dir.create(save_path)
# El directorio para guardar el archivo
png(file = paste0(save_path, "mi_mapa.png"),
    width = 30, # The width of the plot in cm
    height = 27, # The height of the plot in cm
    units = "cm",  # The units to save the plot
    res = 100)

# Crea la gráfica con el diseño necesario
municipio <- municipio %>% st_transform(crs = st_crs(3857))

ggplot() +
  basemaps::basemap_gglayer(municipio %>% st_transform(crs = st_crs(3857))) + 
  geom_sf(data = municipio %>% st_transform(crs = st_crs(3857)), 
          fill = "blue", alpha = 0.030, colour = "black") +
  geom_sf(data = localidad %>% st_transform(crs = st_crs(3857))) +
  coord_sf(expand = FALSE) +
  scale_fill_identity() +
  labs(title = paste0("Municipio de ", municipio$nomgeo, ", ", estado$nomgeo),
       x = "Longitud",
       y = "Latitud",
       caption = "CentroGeo. Servicio de Información y Conocimiento de Localidades Rurales") +
  theme(legend.position = "none",
        axis.text = element_text(size = 12),
        axis.title.x = element_text(size = 18),
        axis.title.y = element_text(size = 18),
        plot.title = element_text(size = 28),
        plot.subtitle = element_text(size = 24),
        plot.caption = element_text(size = 10))

# Cierra la gráfica que se guardó
dev.off()