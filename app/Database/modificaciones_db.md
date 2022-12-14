# Modificaciones de la BD

## Para corregir caracteres incorrectos en subtema AEC_0302 de Desarrollo local

```
update ivp.des_local_2020
set "AEC_0302" = 'Maíz'
where "AEC_0302" LIKE '1.%';

update ivp.des_local_2020
set "AEC_0302" = 'Ganado bovino'
where "AEC_0302" LIKE '2.%';

update ivp.des_local_2020
set "AEC_0302" = 'Café o cafeto'
where "AEC_0302" LIKE '3.%';

update ivp.des_local_2020
set "AEC_0302" = 'Gallo, gallina (ganado aviar)'
where "AEC_0302" LIKE '4.%';

update ivp.des_local_2020
set "AEC_0302" = 'Ganado'
where "AEC_0302" LIKE '5.%';

update ivp.des_local_2020
set "AEC_0302" = 'Otro producto'
where "AEC_0302" LIKE '6.%';

update ivp.des_local_2020
set "AEC_0302" = 'Sin información'
where "AEC_0302" LIKE '7.%';

select "AEC_0302" from ivp.des_local_2020
where "AEC_0302" LIKE '7.%';

SELECT DISTINCT "AEC_0302" from ivp.des_local_2020;
```

## Para corregir caracteres incorrectos en subtema AEC_0303 de Desarrollo local

```
update ivp.des_local_2020
set "AEC_0303" = 'Frijol'
where "AEC_0303" LIKE '1.%';

update ivp.des_local_2020
set "AEC_0303" = 'Maíz'
where "AEC_0303" LIKE '2.%';

update ivp.des_local_2020
set "AEC_0303" = 'Café o cafeto'
where "AEC_0303" LIKE '3.%';

update ivp.des_local_2020
set "AEC_0303" = 'Otro producto'
where "AEC_0303" LIKE '4.%';

update ivp.des_local_2020
set "AEC_0303" = 'Sin información'
where "AEC_0303" LIKE '5.%';

select "AEC_0303" from ivp.des_local_2020
where "AEC_0303" LIKE '7.%';

SELECT DISTINCT "AEC_0303" from ivp.des_local_2020;
```