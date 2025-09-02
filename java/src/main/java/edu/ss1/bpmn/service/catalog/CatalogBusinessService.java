// package edu.ss1.bpmn.service.catalog;

// import java.math.BigDecimal;
// import java.util.List;

// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import edu.ss1.bpmn.domain.dto.catalog.cd.CdDto;
// import edu.ss1.bpmn.domain.entity.catalog.CdEntity;
// import edu.ss1.bpmn.domain.entity.catalog.DiscographyEntity;
// import edu.ss1.bpmn.domain.exception.BadRequestException;
// import edu.ss1.bpmn.domain.exception.RequestConflictException;
// import edu.ss1.bpmn.domain.type.ConditionType;
// import edu.ss1.bpmn.domain.type.FormatType;
// import edu.ss1.bpmn.repository.catalog.CdRepository;
// import edu.ss1.bpmn.repository.catalog.DiscographyRepository;
// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class CatalogBusinessService {

//     private final DiscographyRepository discographyRepository;
//     private final CdRepository cdRepository;
//     private final CdService cdService;

//     /**
//      * Validates stock availability and business rules before purchase
//      */
//     public void validateStockAvailability(Long discographyId, Integer requestedQuantity) {
//         DiscographyEntity discography = discographyRepository.findById(discographyId)
//                 .orElseThrow(() -> new BadRequestException("Discografía no encontrada"));

//         if (!discography.isVisible()) {
//             throw new BadRequestException("El artículo no está disponible para la venta");
//         }

//         if (discography.getStock() == null || discography.getStock() < requestedQuantity) {
//             throw new BadRequestException("Stock insuficiente. Disponible: " + 
//                 (discography.getStock() != null ? discography.getStock() : 0));
//         }

//         // Check for special edition vinyl limitations
//         if (discography.getFormat() == FormatType.VINYL) {
//             validateVinylAvailability(discographyId, requestedQuantity);
//         }
//     }

//     /**
//      * Validates vinyl special edition limitations
//      */
//     private void validateVinylAvailability(Long discographyId, Integer requestedQuantity) {
//         // Special editions have limited stock - additional validation could be added here
//         // For now, we rely on the stock field in the discography
//     }

//     /**
//      * Calculate final price based on format and condition
//      */
//     public BigDecimal calculateFinalPrice(Long discographyId, ConditionType condition) {
//         DiscographyEntity discography = discographyRepository.findById(discographyId)
//                 .orElseThrow(() -> new BadRequestException("Discografía no encontrada"));

//         BigDecimal basePrice = discography.getPrice();
        
//         if (discography.getFormat() == FormatType.CASSETTE && condition != null) {
//             return switch (condition) {
//                 case NEW -> basePrice;
//                 case SEMI_USED -> basePrice.multiply(BigDecimal.valueOf(0.8)); // 20% discount
//                 case USED -> basePrice.multiply(BigDecimal.valueOf(0.5)); // 50% discount
//             };
//         }

//         return basePrice;
//     }

//     /**
//      * Create CD bundle promotion (genre-based, max 4 CDs, 10% discount)
//      */
//     @Transactional
//     public BigDecimal calculateGenreBundlePrice(String genreName, List<Long> cdIds) {
//         if (cdIds.size() > 4) {
//             throw new BadRequestException("El bundle por género no puede tener más de 4 CDs");
//         }

//         List<CdDto> cds = cdService.findByGenre(genreName);
//         BigDecimal totalPrice = BigDecimal.ZERO;

//         for (Long cdId : cdIds) {
//             CdDto cd = cds.stream()
//                     .filter(c -> c.discographyId().equals(cdId))
//                     .findFirst()
//                     .orElseThrow(() -> new BadRequestException("CD con ID " + cdId + " no pertenece al género " + genreName));
            
//             totalPrice = totalPrice.add(cd.discography().price());
//         }

//         // Apply 10% discount
//         return totalPrice.multiply(BigDecimal.valueOf(0.9));
//     }

//     /**
//      * Create random CD bundle promotion (max 7 CDs, 30% discount)
//      */
//     @Transactional
//     public BigDecimal calculateRandomBundlePrice(List<Long> cdIds) {
//         if (cdIds.size() > 7) {
//             throw new BadRequestException("El bundle aleatorio no puede tener más de 7 CDs");
//         }

//         BigDecimal totalPrice = BigDecimal.ZERO;

//         for (Long cdId : cdIds) {
//             CdDto cd = cdService.findCdById(cdId);
//             totalPrice = totalPrice.add(cd.discography().price());
//         }

//         // Apply 30% discount
//         return totalPrice.multiply(BigDecimal.valueOf(0.7));
//     }

//     /**
//      * Update stock after purchase
//      */
//     @Transactional
//     public void updateStockAfterPurchase(Long discographyId, Integer purchasedQuantity) {
//         DiscographyEntity discography = discographyRepository.findById(discographyId)
//                 .orElseThrow(() -> new BadRequestException("Discografía no encontrada"));

//         Integer currentStock = discography.getStock();
//         if (currentStock == null || currentStock < purchasedQuantity) {
//             throw new RequestConflictException("Stock insuficiente para completar la compra");
//         }

//         discography.setStock(currentStock - purchasedQuantity);
//         discographyRepository.save(discography);

//         // Hide item if stock reaches zero
//         if (discography.getStock() == 0) {
//             discography.setVisible(false);
//             discographyRepository.save(discography);
//         }
//     }

//     /**
//      * Check if item is available for pre-sale
//      */
//     public boolean isAvailableForPreSale(Long discographyId) {
//         DiscographyEntity discography = discographyRepository.findById(discographyId)
//                 .orElseThrow(() -> new BadRequestException("Discografía no encontrada"));

//         return discography.getRelease() != null && 
//                discography.getRelease().isAfter(java.time.Instant.now());
//     }

//     /**
//      * Validate format-specific business rules
//      */
//     public void validateFormatSpecificRules(Long discographyId, FormatType format) {
//         DiscographyEntity discography = discographyRepository.findById(discographyId)
//                 .orElseThrow(() -> new BadRequestException("Discografía no encontrada"));

//         if (!discography.getFormat().equals(format)) {
//             throw new BadRequestException("El formato especificado no coincide con la discografía");
//         }

//         switch (format) {
//             case VINYL -> validateVinylRules(discographyId);
//             case CASSETTE -> validateCassetteRules(discographyId);
//             case CD -> validateCdRules(discographyId);
//         }
//     }

//     private void validateVinylRules(Long discographyId) {
//         // Vinyl-specific validations (size, special editions, etc.)
//     }

//     private void validateCassetteRules(Long discographyId) {
//         // Cassette-specific validations (condition-based pricing, etc.)
//     }

//     private void validateCdRules(Long discographyId) {
//         // CD-specific validations (bundle eligibility, etc.)
//     }
// }
