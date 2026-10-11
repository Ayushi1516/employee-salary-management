package com.salary_service.Services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;


/**
 * Sends events to Kafka only after the DB transaction commits, so a rollback never emits a phantom event.
 * Trade-off: if the process dies between commit and send, the event is lost. A transactional outbox table
 * closes that gap (documented as a next step in docs/design-notes.md).
 */
@Component
public class SalaryEventPublisher {


}
