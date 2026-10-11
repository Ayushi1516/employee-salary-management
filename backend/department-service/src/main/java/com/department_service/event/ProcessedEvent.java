package com.department_service.event;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "processed_event")
public class ProcessedEvent {
    @Id
    @Column(name = "event_id", length = 36) private String eventId;

    protected ProcessedEvent() { }
    ProcessedEvent(String eventId) { this.eventId = eventId; }
    String getEventId() { return eventId; }
}
