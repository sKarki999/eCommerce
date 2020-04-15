package com.codecrush.ecommerce.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;

import com.codecrush.ecommerce.entity.Product;
import com.codecrush.ecommerce.entity.ProductCategory;

@Configuration
@SuppressWarnings("rawtypes") 
public class MyDataRestConfig implements RepositoryRestConfigurer {
	
	/*
	 * to expose id,
	 * inject EntityManager
	 */
	@Autowired
	private EntityManager entityManager;
	
	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
		
		HttpMethod[] theUnsupportedActions = {
			HttpMethod.DELETE, HttpMethod.PUT, HttpMethod.POST	
		};
		
		
		// disable HTTP Methods for Product: POST, PUT and DELETE
		config.getExposureConfiguration()
			.forDomainType(Product.class)
			.withItemExposure((metadata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
			.withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
			
		// disable HTTP Methods for ProductCategory: POST, PUT and DELETE
		config.getExposureConfiguration()
			.forDomainType(ProductCategory.class)
			.withItemExposure((metadata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
			.withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
		
//		/*
//		 * two coding ways of exposing id
//		 * Expose id in Json output 
//		 * 1st way
//		 */
//		config.exposeIdsFor(entityManager.getMetamodel().getEntities().stream()
//				.map(Type::getJavaType)
//				.toArray(Class[]::new));	
	
		
		/* 2nd way
		 * call an internal helper method
		 */
        exposeIds(config);
		
	}
	
	private void exposeIds(RepositoryRestConfiguration config) {

        // expose entity ids
        //

        // - get a list of all entity classes from the entity manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // - create an array of the entity types
        List<Class> entityClasses = new ArrayList<>();

        // - get the entity types for the entities
        for (EntityType tempEntityType : entities) {
            entityClasses.add(tempEntityType.getJavaType());
        }

        // - expose the entity ids for the array of entity/domain types
        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
	
}
